import { create } from "zustand";

export interface UploadFile {
  id: string;
  fileName: string;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  url: string | null;
  error: Error | null;
}

interface UploadState {
  uploads: Record<string, UploadFile>;
  addUpload: (id: string, fileName: string) => void;
  updateProgress: (id: string, progress: number) => void;
  setError: (id: string, error: Error) => void;
  setSuccess: (id: string, url: string) => void;
  removeUpload: (id: string) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploads: {},

  addUpload: (id, fileName) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: {
          id,
          fileName,
          progress: 0,
          status: "idle",
          url: null,
          error: null,
        },
      },
    })),

  updateProgress: (id, progress) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: {
          ...state.uploads[id],
          progress,
          status: "uploading",
        },
      },
    })),

  setError: (id, error) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: {
          ...state.uploads[id],

          error,
          status: "error",
        },
      },
    })),

  setSuccess: (id, url) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: {
          ...state.uploads[id],
          progress: 100,
          url,
          status: "success",
        },
      },
    })),

  removeUpload: (id) =>
    set((state) => {
      const newUploads = { ...state.uploads };
      delete newUploads[id];
      return { uploads: newUploads };
    }),
}));
