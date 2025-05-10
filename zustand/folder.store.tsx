import { create } from "zustand";

/**
 * @deprecated Use Next.js router navigation instead.
 * This store is maintained for backward compatibility with components that still use it,
 * but new components should use URL-based navigation.
 */
interface FolderState {
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
}

export const useFolderStore = create<FolderState>((set) => ({
  currentFolderId: null,
  setCurrentFolderId: (id) => set({ currentFolderId: id }),
}));
