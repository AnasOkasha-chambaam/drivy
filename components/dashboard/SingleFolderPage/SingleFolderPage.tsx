"use client";

import { FilesList } from "@/components/shared/FilesList";
import { useFolderStore } from "@/zustand/folder.store";
import { User } from "next-auth";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function SingleFolderPage({ user }: { user: User }) {
  const params = useParams();
  const folderId = params.folderId as string;
  const { setCurrentFolderId } = useFolderStore();

  // Keep folder store in sync with URL for components that still use it
  useEffect(() => {
    setCurrentFolderId(folderId === "root" ? null : folderId);
  }, [folderId, setCurrentFolderId]);

  return <FilesList user={user} />;
}
