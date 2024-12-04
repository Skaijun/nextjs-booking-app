"use server";

import { createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function createSession(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    // You can return any result of the action.
    // Here, we return only the error.
    return { error: true, message: "Please fill in all form fields" };
  }

  const { account } = await createAdminClient();

  try {
    // to generate a session
    const session = await account.createEmailPasswordSession(email, password);

    //create cookie
    const sessionCookies = await cookies();
    sessionCookies.set("appwrite-user-session", session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(session.expire),
      path: "/",
    });

    return { success: true, message: "Logged in successfully!" };
  } catch (error) {
    const errorMsg = error.response?.message || "Invalid credentials";
    return {
      error: true,
      message: errorMsg,
    };
  }
}

export default createSession;
