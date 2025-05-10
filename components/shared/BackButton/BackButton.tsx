"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

export const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const isRootPath = pathname === "/dashboard/folders/root";

  const handleBack = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      aria-label="Go back"
      className="flex items-center gap-1 mr-2"
      disabled={isRootPath || isPending}
    >
      {isPending && <Loader2Icon size={14} className="animate-spin" />}
      {!isPending && <ArrowLeft size={14} />}
      <span>Back</span>
    </Button>
  );
};
