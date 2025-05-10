import { SaveIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SignOutButton } from "../buttons";
import { cn } from "@/lib/utils";
import { User } from "next-auth";
import { capitalize, getFirstName } from "@/lib/name.utils";

export const AlreadyLoggedIn = ({
  user,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  user: User;
}) => {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <Link href="/" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <SaveIcon className="size-6" />
          </div>
          <span className="sr-only">Drivy.</span>
        </Link>
        <h1 className="text-xl font-bold">
          Welcome to Drivy, {capitalize(getFirstName(user.name))}.
        </h1>
      </div>

      <div className="border p-5">
        <div className="w-full max-w-sm">
          <h2 className="text-lg text-center font-bold">
            You are already logged in.
          </h2>
        </div>

        <div className="w-full max-w-sm">
          <p className="text-center text-sm">
            You can go back to the{" "}
            <Link href="/" className="underline underline-offset-4">
              homepage
            </Link>
            .
          </p>
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-3">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
};
