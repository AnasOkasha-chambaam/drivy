import { SignedIn } from "@/components/auth";
import SingleFolderPage from "@/components/dashboard/SingleFolderPage/SingleFolderPage";
import React from "react";

const FolderPage = () => {
  return <SignedIn>{(user) => <SingleFolderPage user={user} />}</SignedIn>;
};

export default FolderPage;
