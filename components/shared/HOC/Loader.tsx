"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BarLoader } from "react-spinners";

export const LoaderHOC = ({
  isLoading,
  children,
  loaderColor = "var(--primary)",
  className = "",
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loaderColor?: string;
  className?: string;
}) => {
  return (
    <>
      {isLoading ? (
        <BarLoader color={loaderColor} className={cn(`w-full`, className)} />
      ) : (
        children
      )}
    </>
  );
};
