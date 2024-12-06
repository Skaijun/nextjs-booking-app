"use server";

import { createSessionClient } from "@/config/appwrite";
import { formatToUTCDateTime, hasDateRangesOverlap } from "@/util/dateHelpers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

async function checkRoomAvailability(roomId, checkIn, checkOut) {
  // retrieve the session cookie
  const sessionCookies = await cookies();
  const userSessionCookie = sessionCookies.get("appwrite-user-session");

  if (!userSessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(userSessionCookie.value);

    const checkInDateTime = formatToUTCDateTime(checkIn);
    const checkOutDateTime = formatToUTCDateTime(checkOut);

    // Fetch all bookings for given room
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      [Query.equal("room_id", roomId)]
    );

    // loop over bookings and check for overlaps
    for (const booking of bookings) {
      const bookingCheckInDateTime = formatToUTCDateTime(booking.check_in);
      const bookingCheckOutDateTime = formatToUTCDateTime(booking.check_out);

      if (
        hasDateRangesOverlap(
          checkInDateTime,
          checkOutDateTime,
          bookingCheckInDateTime,
          bookingCheckOutDateTime
        )
      ) {
        return false; // do not book!
      }
    }

    return true;
  } catch (error) {
    console.log("Failed to check room availability", error);
    return {
      error: true,
      message: "Failed to check room availability!",
    };
  }
}

export default checkRoomAvailability;
