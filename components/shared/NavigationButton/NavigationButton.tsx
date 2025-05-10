"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface NavigationButtonProps extends React.ComponentProps<typeof Button> {
  href: string;
  loadingText?: string;
}

export function NavigationButton({
  href,
  children,
  loadingText,
  ...props
}: NavigationButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending} {...props}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || "Loading..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
