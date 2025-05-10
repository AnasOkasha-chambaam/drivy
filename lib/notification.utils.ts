"use client";

/**
 * Utility for native browser notifications
 */
export const NotificationUtils = {
  /**
   * Check if notifications are supported by the browser
   */
  isSupported(): boolean {
    return "Notification" in window;
  },

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn("Notifications are not supported in this browser");
      return "denied";
    }

    return await Notification.requestPermission();
  },

  /**
   * Get current notification permission
   */
  getPermissionStatus(): NotificationPermission | null {
    if (!this.isSupported()) {
      return null;
    }

    return Notification.permission;
  },

  /**
   * Show a browser notification (useful as fallback if FCM isn't available)
   */
  showNotification(
    title: string,
    options?: NotificationOptions
  ): Notification | null {
    if (!this.isSupported() || Notification.permission !== "granted") {
      return null;
    }

    return new Notification(title, options);
  },

  /**
   * Register a service worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/",
          }
        );

        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
        return registration;
      } catch (error) {
        console.error("Service Worker registration failed:", error);
        return null;
      }
    }

    console.warn("Service Workers are not supported in this browser");
    return null;
  },
};
