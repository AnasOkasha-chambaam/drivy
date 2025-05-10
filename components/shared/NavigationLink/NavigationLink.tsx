"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface NavigationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  loadingText?: string;
  showLoadingIndicator?: boolean;
}

export function NavigationLink({
  href,
  children,
  loadingText,
  className,
  showLoadingIndicator = true,
  ...props
}: NavigationLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only handle transition for internal links
    if (href.startsWith("/")) {
      e.preventDefault();

      startTransition(() => {
        router.push(href);
      });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center",
        isPending && "pointer-events-none opacity-70",
        className
      )}
      aria-disabled={isPending}
      {...props}
    >
      {isPending && showLoadingIndicator ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Link>
  );
}
