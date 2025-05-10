"use client";
import { LoaderHOC } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/auth/auth.actions";
import { LogOutIcon } from "lucide-react";
import { useActionState } from "react";

export const SignOutButton = () => {
  const [, signOut, isSigningOut] = useActionState(() => {
    signOutUser();
  }, null);
  return (
    <form action={signOut}>
      <Button variant="destructive" className="w-full" disabled={isSigningOut}>
        <LoaderHOC isLoading={isSigningOut}>
          <>
            <LogOutIcon />
            Sign Out
          </>
        </LoaderHOC>
      </Button>
    </form>
  );
};
