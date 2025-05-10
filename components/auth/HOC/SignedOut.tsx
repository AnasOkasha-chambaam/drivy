import { auth } from "@/auth";
import React from "react";

export const SignedOut = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();
  const user = session?.user;
  const isLoggedIn = !!user;
  return (!isLoggedIn && children) || null;
};
