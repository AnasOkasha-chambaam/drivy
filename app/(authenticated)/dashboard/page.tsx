import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to folders page
  redirect("/dashboard/folders/root");
}
