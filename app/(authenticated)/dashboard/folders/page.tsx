"use client";

import { redirect } from "next/navigation";

export default function FoldersPage() {
  // Redirect to the root folder
  redirect("/dashboard/folders/root");
}
