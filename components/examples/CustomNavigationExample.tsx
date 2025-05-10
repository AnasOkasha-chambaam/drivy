"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import useNavigationWithTransition from "@/hooks/useNavigationWithTransition";

export function CustomNavigationExample() {
  const { navigate, isNavigating } = useNavigationWithTransition({
    onBeforeNavigation: () => {
      console.log("Navigation is about to start");
      // You could show a toast notification here
    },
    onAfterNavigation: () => {
      console.log("Navigation has started");
      // You could update some global state here
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Custom Navigation Hook Example</CardTitle>
        <CardDescription>
          This example uses the useNavigationWithTransition hook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => navigate("/dashboard")}
          disabled={isNavigating}
          className="w-full"
        >
          {isNavigating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Navigating to Dashboard...
            </>
          ) : (
            "Go to Dashboard"
          )}
        </Button>

        <Button
          onClick={() => navigate("/dashboard/folders")}
          disabled={isNavigating}
          variant="outline"
          className="w-full"
        >
          {isNavigating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Folders...
            </>
          ) : (
            "View Folders"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
