"use client";
import { Progress } from "@/components/ui/progress";
import { useUploadStore } from "@/zustand/upload.store";
import React, { useEffect } from "react";
import { toast } from "sonner";

export const UploadsToasts = () => {
  const { uploads } = useUploadStore((state) => state);

  useEffect(() => {
    Object.values(uploads).forEach((upload) => {
      toast.loading(`Uploading "${upload.fileName}"`, {
        id: upload.id,
        duration: 0,
        description: <Progress value={upload.progress} />,
      });
    });
  }, [uploads]);
  return null;
};
