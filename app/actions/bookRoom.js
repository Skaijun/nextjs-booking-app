"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { createSessionClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";
import checkRoomAvailability from "./checkRoomAvailability";

async function bookRoom(prevState, formData) {
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

    // extract date and time from the formData
    const checkInDate = formData.get("check_in_date");
    const checkOutDate = formData.get("check_out_date");
    const checkInTime = formData.get("check_in_time");
    const checkOutTime = formData.get("check_out_time");
    const roomId = formData.get("room_id");

    // combine date and time to ISO 8601 format
    const checkInDateTime = `${checkInDate}T${checkInTime}`;
    const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

    const isAvailable = await checkRoomAvailability(
      roomId,
      checkInDateTime,
      checkOutDateTime
    );

    if (!isAvailable) {
      return {
        error: true,
        message: "This room is already booked for selected time!",
      };
    }

    const bookingData = {
      check_in: checkInDateTime,
      check_out: checkOutDateTime,
      user_id: user.id,
      room_id: roomId,
    };

    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      ID.unique(),
      bookingData
    );

    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Successfully booked the Room!",
    };
  } catch (error) {
    console.log("Failed to book room", error);
    const errorMsg =
      error.response?.message || "Smth went wront! Failed to book room!";
    return {
      error: true,
      message: errorMsg,
    };
  }
}

export default bookRoom;
