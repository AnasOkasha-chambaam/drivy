"use client";

import { database } from "@/firebase/firebase.config";
import { FirebaseError } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { create } from "zustand";
import {
  deleteFile as deleteFileFromStorage,
  createFolder,
  addFile,
} from "@/lib/actions/firebase/collections/file.actions";
import { sendFileDeletedNotification } from "@/lib/actions/firebase/notifications.actions";

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: number;
  isFolder?: boolean;
  parentId?: string | null;
}

interface FileState {
  files: FileData[];
  isLoading: boolean;
  isDeleting: string | false;
  error: string | null;
  unsubscribe: (() => void) | null;
  startRealtimeUpdates: (limitCount?: number) => void;
  stopRealtimeUpdates: () => void;
  fetchFiles: (limitCount?: number) => Promise<void>;
  deleteFile: (
    fileId: string,
    fileName: string,
    userId?: string
  ) => Promise<void>;
}

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  isLoading: true,
  isDeleting: false,
  error: null,
  unsubscribe: null,

  startRealtimeUpdates: (limitCount = 50) => {
    get().stopRealtimeUpdates();

    set({ isLoading: true });

    const filesCollection = collection(database, "files");
    const filesQuery = query(
      filesCollection,
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      filesQuery,
      (snapshot) => {
        const fetchedFiles: FileData[] = [];
        snapshot.forEach((doc) => {
          fetchedFiles.push({
            id: doc.id,
            ...(doc.data() as Omit<FileData, "id">),
          });
        });

        set({ files: fetchedFiles, isLoading: false, error: null });
      },
      (error) => {
        console.error("Error in realtime updates:", error);
        set({
          error:
            error instanceof FirebaseError
              ? error.message
              : "Failed to get realtime updates",
          isLoading: false,
        });
      }
    );

    set({ unsubscribe });
  },

  stopRealtimeUpdates: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },

  fetchFiles: async (limitCount = 50) => {
    try {
      set({ isLoading: true, error: null });

      const filesCollection = collection(database, "files");
      const filesQuery = query(
        filesCollection,
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(filesQuery);
      const fetchedFiles: FileData[] = [];

      querySnapshot.forEach((doc) => {
        fetchedFiles.push({
          id: doc.id,
          ...(doc.data() as Omit<FileData, "id">),
        });
      });

      set({ files: fetchedFiles, isLoading: false });
    } catch (error) {
      console.error("Error fetching files:", error);
      set({
        error:
          error instanceof FirebaseError
            ? error.message
            : "Failed to fetch files",
        isLoading: false,
      });
    }
  },

  deleteFile: async (fileId: string, fileName: string, userId?: string) => {
    try {
      set({ isDeleting: fileId, error: null });

      const state = get();
      const fileToDelete = state.files.find((file) => file.id === fileId);

      // If it's a folder, recursively delete all its contents
      if (fileToDelete?.isFolder) {
        // Get all child files and folders
        const childFiles = state.files.filter(
          (file) => file.parentId === fileId
        );

        // Delete all children first
        for (const child of childFiles) {
          // Only pass URL for actual files, not for folders
          await get().deleteFile(
            child.id,
            child.isFolder ? "" : child.name,
            userId
          );
        }

        // Delete the folder document from Firestore
        await deleteDoc(doc(database, "files", fileId));
      } else {
        // Delete from Storage if it's a file
        if (fileName) {
          await deleteFileFromStorage(fileName);
        }

        // Delete from Firestore
        await deleteDoc(doc(database, "files", fileId));

        // Send notification if userId is provided
        if (userId && fileName) {
          await sendFileDeletedNotification(userId, fileName);
        }
      }

      // Update state by removing the deleted file
      set((state) => ({
        files: state.files.filter((file) => file.id !== fileId),
        isDeleting: false,
      }));
    } catch (error) {
      console.error("Error deleting file:", error);
      set({
        error:
          error instanceof FirebaseError
            ? error.message
            : "Failed to delete file",
        isDeleting: false,
      });
    }
  },
}));
