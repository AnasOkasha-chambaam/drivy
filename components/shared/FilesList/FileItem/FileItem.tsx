"use client";

import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "@/lib/date.utils";
import { formatBytes } from "@/lib/file.utils";
import { FileData } from "@/zustand/files.store";
import {
  ExternalLinkIcon,
  FolderIcon,
  ImageIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import { useTransition } from "react";

interface FileItemProps {
  file: FileData;
  onDelete: (file: FileData) => void;
  onFolderClick: (folderId: string) => void;
  isDeleting: boolean;
}

export const FileItem = ({
  file,
  onDelete,
  onFolderClick,
  isDeleting,
}: FileItemProps) => {
  const [isPending, startTransition] = useTransition();

  const handleFolderClick = () => {
    if (file.isFolder) {
      startTransition(() => {
        onFolderClick(file.id);
      });
    }
  };

  return (
    <div
      className={`border rounded-md p-4 hover:bg-muted/50 transition-colors ${
        file.isFolder ? "cursor-pointer" : ""
      } ${isPending ? "opacity-70 pointer-events-none" : ""}`}
      onClick={file.isFolder ? handleFolderClick : undefined}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {file.isFolder ? (
            <div className="relative">
              <FolderIcon className="h-8 w-8 text-foreground/50" />
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2Icon className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          ) : (
            <ImageIcon className="h-8 w-8 text-foreground/50" />
          )}
          <div>
            <p className="font-medium truncate max-w-[180px]">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {file.isFolder ? "Folder" : formatBytes(file.size)} •{" "}
              {formatDistanceToNow(file.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {!file.isFolder && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground"
              disabled={isDeleting}
            >
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file);
            }}
            className="text-destructive/70 hover:text-destructive disabled:!text-destructive/70"
            disabled={isDeleting}
          >
            {isDeleting && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {!isDeleting && <Trash2Icon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
