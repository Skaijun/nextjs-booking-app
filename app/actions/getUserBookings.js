"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";
import checkAuth from "./checkAuth";

async function getUserBookings() {
  // retrieve the session cookie
  const sessionCookies = await cookies();
  const userSessionCookie = sessionCookies.get("appwrite-user-session");

  if (!userSessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(userSessionCookie.value);

    // Get user
    const { user } = await checkAuth();
    if (!user) {
      return {
        error: true,
        message: "You must be logged in!",
      };
    }

    // Fetch current user rooms
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      [Query.equal("user_id", user.id)]
    );

    return bookings;
  } catch (error) {
    console.log("Failed to get bookings", error);
    return {
      error: true,
      message: "Failed to get bookings",
    };
  }
}

export default getUserBookings;
