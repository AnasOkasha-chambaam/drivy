"use server";

import { getUserByIdFromFirestore } from "./collections/user.actions";
import { getMessaging } from "@/firebase/firebase-admin";

/**
 * Send a notification to a specific user
 * This function should be used on the server to send notifications
 */
export const sendNotificationToUser = async (
  userId: string,
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
    data?: Record<string, string>;
  }
) => {
  try {
    // Get user data to retrieve FCM token
    const user = await getUserByIdFromFirestore(userId);
    if (!user || !user.fcmToken) {
      console.log(`No FCM token found for user ${userId}`);
      return false;
    }
    const adminMessaging = await getMessaging();

    if (!adminMessaging) {
      console.error("Firebase Admin Messaging is not initialized");
      return false;
    }

    // Create the message payload
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        ...(notification.imageUrl && { imageUrl: notification.imageUrl }),
      },
      data: notification.data || {},
      token: user.fcmToken,
    };

    // Send the message
    try {
      const response = await adminMessaging.send(message);
      console.log("Successfully sent message:", response);
      return true;
    } catch (sendError: unknown) {
      console.error("Error sending message:", sendError);

      // If token is invalid, we should probably remove it
      if (
        (sendError as { code: string }).code ===
          "messaging/invalid-registration-token" ||
        (sendError as { code: string }).code ===
          "messaging/registration-token-not-registered"
      ) {
        // TODO: Handle token cleanup here
        console.log(`Invalid token for user ${userId}, should be removed`);
      }

      return false;
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};

/**
 * Send a notification when a file is shared with a user
 */
export const sendFileSharedNotification = async (
  userId: string,
  fileName: string,
  sharedByName: string,
  fileId: string
) => {
  return sendNotificationToUser(userId, {
    title: "New File Shared",
    body: `${sharedByName} shared the file "${fileName}" with you`,
    data: {
      type: "FILE_SHARED",
      fileId,
      fileName,
      sharedBy: sharedByName,
    },
  });
};

/**
 * Send a notification when a new folder is created
 */
export const sendFolderCreatedNotification = async (
  userId: string,
  folderName: string,
  folderId: string
) => {
  return sendNotificationToUser(userId, {
    title: "New Folder Created",
    body: `The folder "${folderName}" has been created`,
    data: {
      type: "FOLDER_CREATED",
      folderId,
      folderName,
    },
  });
};

/**
 * Send a notification when a file is deleted
 */
export const sendFileDeletedNotification = async (
  userId: string,
  fileName: string
) => {
  return sendNotificationToUser(userId, {
    title: "File Deleted",
    body: `The file "${fileName}" has been deleted`,
    data: {
      type: "FILE_DELETED",
      fileName,
    },
  });
};
