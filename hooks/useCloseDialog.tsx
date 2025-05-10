import { DialogClose } from "@/components/ui/dialog";
import React, { useRef } from "react";

export const useCloseDialog = () => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  return {
    closeDialog: () => {
      if (closeButtonRef.current) {
        closeButtonRef.current.click();
      }
    },
    CloseButton: <DialogClose ref={closeButtonRef} />,
  };
};
