"use server";

import { createAdminClient } from "@/config/appwrite";
import { ID } from "node-appwrite";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

async function createUser(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");

  if (!email || !password) {
    return {
      error: true,
      message: "Please provide email and password!",
    };
  }

  if (confirmPassword !== password) {
    return {
      error: true,
      message: "Passwords do not match!",
    };
  }

  if (password.length < 8) {
    return {
      error: true,
      message: "Please provide password with at least 8 characters long",
    };
  }

  if (!validateEmail(email)) {
    return {
      error: true,
      message: "Invalid email",
    };
  }

  // get account instance
  const { account } = await createAdminClient();

  try {
    // create user
    await account.create(ID.unique(), email, password, name);

    return {
      success: true,
      message: "Successfully registered a new User!",
    };
  } catch (error) {
    console.log("Registration error: ", error);

    return {
      error: true,
      message: "Failed to register a new User!",
    };
  }
}

export default createUser;
