"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavigationButton } from "@/components/shared/NavigationButton";

export function NavigationButtonDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Navigation Examples</CardTitle>
        <CardDescription>
          Click the buttons below to see the loading state during navigation
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <NavigationButton
          href="/dashboard"
          loadingText="Going to Dashboard..."
          className="w-full"
        >
          Go to Dashboard
        </NavigationButton>

        <NavigationButton
          href="/dashboard/folders"
          loadingText="Opening Folders..."
          variant="outline"
          className="w-full"
        >
          View Folders
        </NavigationButton>

        <NavigationButton
          href="/"
          loadingText="Returning Home..."
          variant="secondary"
          className="w-full"
        >
          Back to Home
        </NavigationButton>
      </CardContent>
    </Card>
  );
}
