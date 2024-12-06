"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

async function deleteRoom(roomID) {
  // retrieve the session cookie
  const sessionCookies = await cookies();
  const userSessionCookie = sessionCookies.get("appwrite-user-session");

  if (!userSessionCookie) {
    redirect("/login");
  }

  try {
    const { account, databases } = await createSessionClient(
      userSessionCookie.value
    );

    // Get user's ID
    const user = await account.get();
    const userId = user.$id;

    // Fetch current user rooms
    // const { documents: rooms } = await databases.listDocuments(
    //   process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
    //   process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
    //   [Query.equal("user_id", userId)]
    // );

    // Delete selected Room
    const response = await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      roomID
    );

    // revalidate the cache for this path to observe changes immediately
    revalidatePath("/rooms/my", "layout");
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Successfully deleted room!",
    };
  } catch (error) {
    const errorMsg = error.response?.message || "Failed to delete room";
    return {
      error: true,
      message: errorMsg,
    };
  }
}

export default deleteRoom;
