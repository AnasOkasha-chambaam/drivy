import { auth } from "@/auth";
import { User } from "next-auth";
import React from "react";

export const SignedIn = async ({
  children,
}: {
  children: (user: User) => React.ReactNode;
}) => {
  const session = await auth();
  const user = session?.user;
  const isLoggedIn = !!user;

  if (!isLoggedIn) return null;

  return children(user);
};
