"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export function FileDropzone({
  onDrop,
  children = <p>Drag & drop some files here, or click to select files</p>,
  dragActiveChildren = <p>Drop the files here ...</p>,
}: {
  onDrop: (acceptedFiles: File[]) => void;
  children?: React.ReactNode;
  dragActiveChildren?: React.ReactNode;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,

    accept: {
      "image/*": [],
    },
    multiple: true,
    maxSize: 1024 * 1024 * 5, // 5MB

    onDropRejected: (rejectedFiles) => {
      const errorMessage = rejectedFiles[0].errors[0].message;
      toast.error("File upload failed", {
        description: errorMessage,
      });
    },
  });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        {isDragActive && dragActiveChildren}

        {!isDragActive && children}
      </div>
    </div>
  );
}
