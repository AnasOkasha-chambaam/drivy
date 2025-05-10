import { TopBar } from "@/components/TopBar";
import { SessionProvider } from "next-auth/react";
import React from "react";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <>
        <TopBar />
        {children}
      </>
    </SessionProvider>
  );
};

export default AuthenticatedLayout;
