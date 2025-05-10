"use client";

import React from "react";
import { NavigationButtonDemo } from "@/components/shared/NavigationButton";
import { NavigationLink } from "@/components/shared/NavigationLink";
import { CustomNavigationExample } from "@/components/examples";
import { Separator } from "@/components/ui/separator";

export default function NavigationDemoPage() {
  return (
    <div className="container py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Navigation Components with Loading States
        </h1>
        <p className="text-muted-foreground mb-4">
          This page demonstrates different ways to show loading feedback during
          page navigation.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Button-based Navigation</h2>
        <p className="text-muted-foreground">
          The NavigationButton component wraps Next.js navigation in a button
          with a loading indicator.
        </p>
        <NavigationButtonDemo />
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Link-based Navigation</h2>
        <p className="text-muted-foreground">
          The NavigationLink component provides link-based navigation with
          loading indicators.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="flex gap-4">
            <NavigationLink
              href="/dashboard"
              className="text-blue-600 hover:underline"
              loadingText="Going to Dashboard..."
            >
              Dashboard
            </NavigationLink>

            <NavigationLink
              href="/dashboard/folders"
              className="text-blue-600 hover:underline"
              loadingText="Opening Folders..."
            >
              Folders
            </NavigationLink>

            <NavigationLink
              href="/"
              className="text-blue-600 hover:underline"
              loadingText="Going Home..."
            >
              Home
            </NavigationLink>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Custom Hook Approach</h2>
        <p className="text-muted-foreground">
          The useNavigationWithTransition hook allows you to add navigation
          loading states to any component.
        </p>
        <CustomNavigationExample />
      </div>
    </div>
  );
}
