"use server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import { addFile } from "./firebase/collections/file.actions";

export const upload = async (
  file: File,
  parentId?: string | null,
  id = crypto.randomUUID()
) => {
  // Get the current user session
  const session = await auth();
  const userId = session?.user?.id;

  // Initialize upload in Zustand store
  const { url } = await put(`drivy/${file.name}`, file, {
    access: "public",
    allowOverwrite: true,
    onUploadProgress: () => {},
  });

  await addFile({
    name: file.name,
    size: file.size,
    type: file.type,
    url,
    parentId,
    userId,
  });

  return id; // Return the ID so the component can track this specific upload
};

export const uploadMultiple = async (
  files: File[],
  parentId?: string | null
) => {
  const ids = await Promise.all(files.map((file) => upload(file, parentId)));
  return ids; // Return the IDs of all uploads
};
