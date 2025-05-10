"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "@/lib/date.utils";
import {
  Notification,
  useNotificationStore,
} from "@/zustand/notification.store";
import { BellIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const NotificationCenter = () => {
  const {
    notifications,
    requestPermission,
    initializeMessaging,
    stopListening,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    isLoading,
    error,
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Initialize notifications when component mounts
  useEffect(() => {
    const initNotifications = async () => {
      const permissionGranted = await requestPermission();
      if (permissionGranted) {
        await initializeMessaging();
      }
    };

    initNotifications();

    // Clean up on unmount
    return () => {
      stopListening();
    };
  }, [initializeMessaging, requestPermission, stopListening]);

  // Mark all notifications as read when dropdown is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // Navigate or perform action based on notification type
    if (notification.data?.type === "FILE_SHARED") {
      // Navigate to shared file
      console.log("Navigate to shared file:", notification.data.fileId);
    } else if (notification.data?.type === "FOLDER_CREATED") {
      // Navigate to new folder
      console.log("Navigate to folder:", notification.data.folderId);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[340px]">
        <div className="flex items-center justify-between px-4 py-2 font-medium">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
                disabled={notifications.every((n) => n.read)}
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Mark all read
              </Button> */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearNotifications()}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />

        {isLoading && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="p-4 text-destructive text-sm">Error: {error}</div>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            No notifications yet
          </div>
        )}

        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className={`px-4 py-3 cursor-pointer ${
              !notification.read ? "bg-muted/50" : ""
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between">
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.timestamp, {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.body}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
