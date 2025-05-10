"use server";
import { database } from "@/firebase/firebase.config";
import { del } from "@vercel/blob";
import { collection, addDoc } from "firebase/firestore";
import {
  sendFileSharedNotification,
  sendFolderCreatedNotification,
} from "../notifications.actions";

const files = collection(database, "files");

export const addFile = async (metadata: {
  name: string;
  size: number;
  type: string;
  url: string;
  parentId?: string | null;
  userId?: string;
}) => {
  try {
    const fileDoc = await addDoc(files, {
      name: metadata.name,
      size: metadata.size,
      type: metadata.type,
      url: metadata.url,
      createdAt: Date.now(),
      isFolder: false,
      parentId: metadata.parentId || null,
      createdBy: metadata.userId || null,
    });

    // Optionally send notification to the user who created the file
    if (metadata.userId) {
      await sendFileSharedNotification(
        metadata.userId,
        metadata.name,
        "You", // "You" shared this file (with yourself)
        fileDoc.id
      );
    }

    return fileDoc.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const createFolder = async (
  name: string,
  parentId?: string | null,
  userId?: string
) => {
  try {
    const folderDoc = await addDoc(files, {
      name,
      size: 0,
      type: "folder",
      url: "",
      createdAt: Date.now(),
      isFolder: true,
      parentId: parentId || null,
      createdBy: userId || null,
    });

    // Send notification about new folder creation
    if (userId) {
      await sendFolderCreatedNotification(userId, name, folderDoc.id);
    }

    return folderDoc.id;
  } catch (e) {
    console.error("Error creating folder: ", e);
    throw e;
  }
};

export const deleteFile = async (filePath: string) => {
  try {
    await del(filePath);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};
