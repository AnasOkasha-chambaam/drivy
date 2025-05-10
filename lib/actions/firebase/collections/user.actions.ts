"use server";

import { database } from "@/firebase/firebase.config";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";

const users = collection(database, "users");

/**
 * Save or update user FCM token in Firestore
 */
export const updateUserFcmToken = async (userId: string, token: string) => {
  try {
    const userDocRef = doc(users, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Update existing user
      await updateDoc(userDocRef, {
        fcmToken: token,
        lastTokenUpdate: serverTimestamp(),
      });
    } else {
      // Create new user document
      await setDoc(userDocRef, {
        userId,
        fcmToken: token,
        createdAt: serverTimestamp(),
        lastTokenUpdate: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error("Error updating user FCM token:", error);
    return false;
  }
};

/**
 * Get user by ID from Firestore
 */
export const getUserByIdFromFirestore = async (
  userId: string
): Promise<DocumentData | null> => {
  try {
    const userDocRef = doc(users, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return { id: userDocSnap.id, ...userDocSnap.data() };
    } else {
      console.log(`No user found with ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
