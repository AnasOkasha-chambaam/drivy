"use client";

import { useFileStore } from "@/zustand/files.store";
import { ChevronRightIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const FolderBreadcrumbs = () => {
  const params = useParams();
  const folderId = params.folderId as string;
  const { files } = useFileStore();
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ id: string | null; name: string }>
  >([]);

  useEffect(() => {
    if (folderId === "root" || !folderId) {
      setBreadcrumbs([{ id: null, name: "Home" }]);
      return;
    }

    const buildBreadcrumbs = () => {
      // Start with home as the first breadcrumb
      const breadcrumbsArray: Array<{ id: string | null; name: string }> = [];
      let currentId: string | null = folderId;
      const folderPath: Array<{ id: string | null; name: string }> = [];

      // Collect all folders in the path
      while (currentId) {
        const folder = files.find((file) => file.id === currentId);
        if (!folder) break;

        folderPath.push({ id: folder.id, name: folder.name });
        currentId = folder.parentId || null; // Ensure it's string or null
      }

      // Add home folder first
      breadcrumbsArray.push({ id: null, name: "Home" });

      // Add folders from parent to child (reverse of how we collected them)
      for (let i = folderPath.length - 1; i >= 0; i--) {
        breadcrumbsArray.push(folderPath[i]);
      }

      setBreadcrumbs(breadcrumbsArray);
    };

    buildBreadcrumbs();
  }, [folderId, files]);

  return (
    <div className="flex items-center flex-wrap gap-1 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <div key={crumb.id || "root"} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon
                size={14}
                className="mx-1 text-muted-foreground"
              />
            )}

            {isLast ? (
              <span className="font-medium flex items-center underline">
                {crumb.id === null && <HomeIcon size={16} className="mr-1" />}
                {crumb.name}
              </span>
            ) : (
              <Link
                href={`/dashboard/folders/${crumb.id || "root"}`}
                className="hover:underline text-muted-foreground hover:text-foreground transition-colors"
              >
                {index === 0 ? (
                  <div className="flex items-center">
                    <HomeIcon size={16} className="mr-1" />
                    <span>Home</span>
                  </div>
                ) : (
                  crumb.name
                )}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
