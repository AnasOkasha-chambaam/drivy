"use server";

import admin from "firebase-admin";

// Initialize Firebase Admin SDK if not already initialized
function getFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      // Create service account from environment variables
      const serviceAccount = {
        type: process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url:
          process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
      };

      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      console.log("Firebase Admin SDK initialized");
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
    }
  }

  return admin;
}

// Create async wrapper functions to export the admin services
export async function getAuth() {
  const admin = getFirebaseAdmin();
  return admin.auth();
}

export async function getFirestore() {
  const admin = getFirebaseAdmin();
  return admin.firestore();
}

export async function getMessaging() {
  const admin = getFirebaseAdmin();
  return admin.messaging();
}

export async function getStorage() {
  const admin = getFirebaseAdmin();
  return admin.storage();
}

// You can also create a generic function to access the admin instance
export async function getAdmin() {
  return getFirebaseAdmin();
}
