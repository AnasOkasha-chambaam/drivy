"use client";

import { TopButtons } from "@/components/dashboard";
import { LoadingFiles } from "@/components/lotties";
import { BackButton, LoaderHOC } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createFolder } from "@/lib/actions/firebase/collections/file.actions";
import { FileData, useFileStore } from "@/zustand/files.store";
import { useFolderStore } from "@/zustand/folder.store";
import { useNotificationStore } from "@/zustand/notification.store";
import { FolderPlusIcon, RefreshCwIcon } from "lucide-react";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileItem } from "./FileItem";

interface FilesListProps {
  user: User;
}

export const FilesList = ({ user }: FilesListProps) => {
  const userId = user.id;
  const { currentFolderId: externalFolderId } = useFolderStore();

  const {
    files,
    isLoading,
    deleteFile,
    isDeleting,
    error,
    startRealtimeUpdates,
    stopRealtimeUpdates,
    fetchFiles,
  } = useFileStore();

  const { addNotification } = useNotificationStore();

  const [internalFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use external folder ID if provided, otherwise use internal state
  const currentFolderId =
    externalFolderId !== undefined ? externalFolderId : internalFolderId;

  // Filter files based on current folder
  const currentFiles = files.filter(
    (file) => file.parentId === currentFolderId
  );

  useEffect(() => {
    // Start realtime updates when component mounts
    startRealtimeUpdates();

    // Clean up subscription when component unmounts
    return () => {
      stopRealtimeUpdates();
    };
  }, [startRealtimeUpdates, stopRealtimeUpdates]);

  const handleDelete = async (file: FileData) => {
    try {
      const toastId = toast.loading(`Deleting ${file.name}...`);
      await deleteFile(file.id, file.name, userId);
      toast.success(`Deleted ${file.name}`, { id: toastId });
    } catch (error) {
      toast.error(`Failed to delete ${file.name}`);
      console.error(error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    try {
      setIsCreatingFolder(true);
      const folderId = await createFolder(
        newFolderName,
        currentFolderId,
        userId
      );
      toast.success(`Created folder ${newFolderName}`);

      // Add local notification even if server notification is sent
      addNotification({
        title: "New Folder Created",
        body: `The folder "${newFolderName}" has been created successfully.`,
        data: { type: "FOLDER_CREATED", folderId, folderName: newFolderName },
      });

      setNewFolderName("");
      setDialogOpen(false);
    } catch (error) {
      toast.error(`Failed to create folder`);
      console.error(error);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        <p>Error: {error}</p>
        <Button onClick={() => fetchFiles()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BackButton />

          <TopButtons />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlusIcon className="h-4 w-4 mr-1" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  disabled={isCreatingFolder}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleCreateFolder}
                    disabled={isCreatingFolder || !newFolderName.trim()}
                  >
                    <LoaderHOC
                      isLoading={isCreatingFolder}
                      loaderColor="var(--primary-foreground)"
                    >
                      Create Folder
                    </LoaderHOC>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex gap-2">
          <Button
            variant={"ghost"}
            onClick={() => fetchFiles()}
            disabled={isLoading}
          >
            <LoaderHOC
              isLoading={isLoading}
              loaderColor="var(--primary-foreground)"
            >
              <RefreshCwIcon />
              Refresh
            </LoaderHOC>
          </Button>
        </div>
      </div>

      {isLoading && files.length === 0 && (
        <div className="flex items-center justify-center opacity-60">
          <LoadingFiles />
        </div>
      )}

      {currentFiles.length === 0 && !isLoading ? (
        <div className="p-6 text-center border rounded-md bg-muted">
          <p className="text-muted-foreground">
            No files found. Upload some files or create folders to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentFiles.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onDelete={handleDelete}
              // onFolderClick={handleFolderClick}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
};
