"use client";

import { create } from "zustand";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";
import { app } from "@/firebase/firebase.config";
import { FirebaseError } from "firebase/app";
import { NotificationUtils } from "@/lib/notification.utils";

// Define notification interface
export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  data?: Record<string, string>;
}

interface NotificationState {
  notifications: Notification[];
  permission: NotificationPermission | null;
  fcmToken: string | null;
  isLoading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;

  // Methods
  requestPermission: () => Promise<boolean>;
  initializeMessaging: () => Promise<void>;
  stopListening: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
}

// Helper function to initialize messaging only in browser
const getMessagingInstance = (): Messaging | null => {
  try {
    if (typeof window !== "undefined") {
      return getMessaging(app);
    }
    return null;
  } catch (error) {
    console.error("Error initializing messaging:", error);
    return null;
  }
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  permission: null,
  fcmToken: null,
  isLoading: false,
  error: null,
  unsubscribe: null,

  requestPermission: async () => {
    try {
      set({ isLoading: true, error: null });

      // Register service worker first
      await NotificationUtils.registerServiceWorker();

      // Then request notification permission
      const permission = await NotificationUtils.requestPermission();
      set({ permission });

      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      set({
        error:
          error instanceof FirebaseError
            ? error.message
            : "Failed to request notification permission",
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  initializeMessaging: async () => {
    try {
      set({ isLoading: true, error: null });

      // Request permission first if not granted
      const { permission, requestPermission } = get();
      if (!permission || permission !== "granted") {
        const granted = await requestPermission();
        if (!granted) return;
      }

      const messaging = getMessagingInstance();

      if (!messaging) {
        throw new Error("Firebase messaging is not available");
      }

      // Get FCM token
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (!currentToken) {
        throw new Error("No registration token available");
      }

      set({ fcmToken: currentToken });
      console.log("FCM Token:", currentToken);

      // Save FCM token to the server
      try {
        const response = await fetch("/api/fcm/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fcmToken: currentToken }),
        });

        if (!response.ok) {
          console.warn(
            "Failed to save FCM token to server:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error saving FCM token to server:", error);
      }

      // Setup foreground message handler
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Message received in foreground:", payload);

        if (payload.notification) {
          get().addNotification({
            title: payload.notification.title || "New Notification",
            body: payload.notification.body || "",
            data: payload.data,
          });
        }
      });

      set({ unsubscribe });
    } catch (error) {
      console.error("Error initializing messaging:", error);
      set({
        error:
          error instanceof FirebaseError
            ? error.message
            : "Failed to initialize messaging",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  stopListening: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false,
      ...notification,
    };

    // Show browser notification if app is in background
    if (document.visibilityState !== "visible") {
      NotificationUtils.showNotification(notification.title, {
        body: notification.body,
        icon: "/file.svg",
        data: notification.data,
      });
    }

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },
}));
