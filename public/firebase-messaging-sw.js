// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBYzXZ3ZW_CRL4NH0uNBo5OxzydjuahT60",
  authDomain: "drivy-8e8c4.firebaseapp.com",
  projectId: "drivy-8e8c4",
  storageBucket: "drivy-8e8c4.firebasestorage.app",
  messagingSenderId: "640332275123",
  appId: "1:640332275123:web:51296d25149ca21dd73fc6",
  measurementId: "G-4R29X9GEZS",
};

// Your web app's Firebase configuration
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  // Customize notification here
  const notificationTitle = payload.notification.title || "Drivy Notification";
  const notificationOptions = {
    body: payload.notification.body || "",
    icon: "/file.svg",
    badge: "/file.svg",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification click received:", event);

  event.notification.close();

  // This will open the app and navigate to the appropriate location
  // You can customize this URL based on the notification payload
  const urlToOpen = new URL("/", self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // See if there's already a tab open with this URL
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If not, open a new tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
