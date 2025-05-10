"use client";
import { LoaderHOC } from "@/components/shared";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCloseDialog } from "@/hooks/useCloseDialog";
import { uploadMultiple } from "@/lib/actions/upload.actions";
import { formatBytes } from "@/lib/file.utils";
import { useFolderStore } from "@/zustand/folder.store";
import {
  CloudUploadIcon,
  DropletIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const UploadFileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  // Get current folder ID from URL parameter
  const params = useParams();
  const urlFolderId = params?.folderId as string;
  // For compatibility with existing code, still use the folder store
  const { currentFolderId } = useFolderStore();

  // Determine actual folder ID - prefer URL param but fall back to store
  const parentId =
    urlFolderId === "root" ? null : urlFolderId || currentFolderId;

  const { closeDialog, CloseButton } = useCloseDialog();

  const onSubmit = useCallback(async () => {
    if (files.length === 0) return;
    setIsLoading(true);
    await uploadMultiple(files, parentId);
    toast.success(
      `${files.length} File${files.length > 1 ? "s" : ""} uploaded successfully`
    );
    setFiles([]);
    setIsLoading(false);
    closeDialog();
  }, [files, closeDialog, parentId]);

  if (files.length === 0)
    return (
      <FileDropzone
        onDrop={onDrop}
        dragActiveChildren={
          <div className="flex flex-col items-center justify-center w-full h-40 p-4 border-2 border-dashed rounded-lg border-green-600/30 gap-2 bg-green-400/10">
            <DropletIcon color="var(--muted-foreground)" />
            <p className="text-sm text-muted-foreground">
              Drop the files here ...
            </p>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center w-full h-40 p-4 border-2 border-dashed rounded-lg bg-muted">
          <CloudUploadIcon color="var(--muted-foreground)" />
          <p className="text-sm text-muted-foreground">
            Drag and drop your files here
          </p>
          <p className="text-sm text-muted-foreground">or</p>
          <span
            className={buttonVariants({
              variant: "link",
            })}
          >
            Browse Files
          </span>
        </div>
      </FileDropzone>
    );

  return (
    <div>
      {CloseButton}
      <ul className="flex flex-col gap-2">
        {files.map((file, index) => {
          return (
            <li
              key={file.name}
              className="flex items-center justify-between gap-2 p-2 border rounded-md hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={40}
                  height={40}
                />
                <p className="truncate w-28">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>
              {
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive/65 hover:text-destructive"
                  onClick={() => {
                    setFiles((prev) => {
                      const newFiles = [...prev];
                      newFiles.splice(index, 1);
                      return newFiles;
                    });
                  }}
                  disabled={isLoading}
                >
                  <Trash2Icon />
                </Button>
              }
            </li>
          );
        })}
      </ul>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 items-center w-full gap-2">
        <Button
          variant="secondary"
          className="w-full text-destructive/85 hover:text-destructive"
          onClick={() => {
            setFiles([]);
          }}
          disabled={isLoading}
        >
          <XIcon />
          Clear All
        </Button>
        <Button className="w-full" onClick={onSubmit} disabled={isLoading}>
          <LoaderHOC
            isLoading={isLoading}
            loaderColor="var(--primary-foreground)"
          >
            <>
              <UploadIcon />
              Upload
            </>
          </LoaderHOC>
        </Button>
      </div>
    </div>
  );
};
