import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { UploadFileForm } from "./UploadFileForm";

export const UploadFileDialog = () => {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "default",
          className: "cursor-pointer",
        })}
      >
        <FileUpIcon /> Add File
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUpIcon /> Upload File
          </DialogTitle>
          <DialogDescription>Upload your file here</DialogDescription>
        </DialogHeader>
        <Separator />
        <UploadFileForm />
      </DialogContent>
    </Dialog>
  );
};
