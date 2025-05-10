"use client";
import { GithubBrandIcon } from "@/components/brands";
import { LoaderHOC } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { signInWithGithub } from "@/lib/actions/auth/auth.actions";
import { useActionState } from "react";

export const GithubSignInButton = () => {
  const [, signIn, isSigningIn] = useActionState(() => {
    signInWithGithub();
  }, null);
  return (
    <form action={signIn}>
      <Button variant="outline" className="w-full" disabled={isSigningIn}>
        <LoaderHOC isLoading={isSigningIn}>
          <>
            <GithubBrandIcon />
            Continue with GitHub
          </>
        </LoaderHOC>
      </Button>
    </form>
  );
};
