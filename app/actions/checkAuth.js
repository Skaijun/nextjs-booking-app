"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function checkAuth() {
  // retrieve the session cookie
  const sessionCookies = await cookies();
  const userSessionCookie = sessionCookies.get("appwrite-user-session");

  if (!userSessionCookie) {
    return {
      isAuthenticated: false,
    };
  }

  try {
    const { account } = await createSessionClient(userSessionCookie.value);
    const user = await account.get();

    return {
      isAuthenticated: true,
      user: {
        id: user.$id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    return {
      isAuthenticated: false,
    };
  }
}

export default checkAuth;
