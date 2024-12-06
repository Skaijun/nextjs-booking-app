"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSessionClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";

async function cancelBooking(bookingId) {
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

    const bookingQueryParams = [
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      bookingId,
    ];

    const booking = await databases.getDocument(...bookingQueryParams);

    // check if booking belongs to the current user
    if (booking.user_id !== user.id) {
      return {
        error: true,
        message: "You are not authorized to cancel this booking!",
      };
    }

    // delete booking
    await databases.deleteDocument(...bookingQueryParams);

    revalidatePath("/bookings", "layout");

    return {
      success: true,
      message: "Successfully cancelled the booking!",
    };
  } catch (error) {
    console.log("Failed to cancel booking", error);
    const errorMsg =
      error.response?.message || "Smth went wront! Failed to cancel booking!";
    return {
      error: true,
      message: errorMsg,
    };
  }
}

export default cancelBooking;
