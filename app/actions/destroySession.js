"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function destroySession() {
  // retrieve the session cookie
  const sessionCookies = await cookies();
  const userSessionCookie = sessionCookies.get("appwrite-user-session");

  if (!userSessionCookie) {
    return {
      error: true,
      message: "No session cookie found",
    };
  }

  try {
    const { account } = await createSessionClient(userSessionCookie.value);

    // delete current session in appwrite
    await account.deleteSession("current");

    // clear session cookie
    sessionCookies.delete("appwrite-user-session");

    return {
      success: true,
      message: "Logged out successfully!",
    };
  } catch (error) {
    const errorMsg = error.response?.message || "Error deleting session";
    return {
      error: true,
      message: errorMsg,
    };
  }
}

export default destroySession;
