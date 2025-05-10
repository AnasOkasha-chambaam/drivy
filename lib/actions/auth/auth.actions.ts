"use server";
import { signIn, signOut } from "@/auth";
import { signInOptions } from "./config";

export const signInWithGithub = async () => {
  await signIn("github", signInOptions);
};

export const signOutUser = async () => {
  await signOut();
};
