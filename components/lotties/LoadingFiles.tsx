"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import LoadingFilesLottie from "@/lottie-files/loading-files.json";

import React from "react";

export const LoadingFiles = () => {
  return <DotLottieReact data={LoadingFilesLottie} loop autoplay />;
};
