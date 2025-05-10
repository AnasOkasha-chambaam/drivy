"use client";

import { FolderBreadcrumbs } from "@/components/dashboard";

export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex flex-col gap-4 p-4">
      <FolderBreadcrumbs />
      {children}
    </div>
  );
}
