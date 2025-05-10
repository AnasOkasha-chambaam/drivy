import { SaveIcon } from "lucide-react";
import Link from "next/link";
import { NavUser } from ".";
import { SignedIn } from "../auth";
import { NotificationCenter } from "../shared";
import { ThemeToggle } from "../theme";
import { Separator } from "../ui/separator";
import { UploadsToasts } from "./UploadsToasters";

export const TopBar = () => {
  return (
    <nav className="flex items-center justify-between w-full h-16 px-4 shadow-md border-b">
      <div className="flex items-center">
        <Link href="/">
          <SaveIcon />
        </Link>
      </div>
      <UploadsToasts />
      <div className="flex items-center gap-3">
        <NotificationCenter />
        <SignedIn>{(user) => <NavUser user={user} />}</SignedIn>
        <Separator orientation="vertical" className="!h-9" />
        <ThemeToggle />
      </div>
    </nav>
  );
};
