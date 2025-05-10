import { NextRequest, NextResponse } from "next/server";
import { updateUserFcmToken } from "@/lib/actions/firebase/collections/user.actions";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get FCM token from request body
    const data = await request.json();
    const { fcmToken } = data;

    if (!fcmToken) {
      return NextResponse.json(
        { error: "FCM Token is required" },
        { status: 400 }
      );
    }

    // Update the user's FCM token
    const userId = session.user.id as string;
    const success = await updateUserFcmToken(userId, fcmToken);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to update FCM token" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating FCM token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
