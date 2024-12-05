"use server";

import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";

async function createRoom(prevState, formData) {
  // get db instance
  const { databases, storage } = await createAdminClient();

  try {
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: true,
        message: "You must be logged in to create a Room!",
      };
    }

    // uploading image
    let imageID;
    const image = formData.get("image");
    if (image && image.size > 0 && image.name !== "undefined")
      try {
        const response = await storage.createFile("rooms", ID.unique(), image);
        imageID = response.$id;
      } catch (error) {
        const errorMsg =
          error.response?.message ||
          "An unexpected error uploading image has occured!";
        return {
          error: true,
          message: errorMsg,
        };
      }

    const newRoom = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      ID.unique(),
      {
        user_id: user.id,
        name: formData.get("name"),
        description: formData.get("description"),
        sqft: formData.get("sqft"),
        capacity: formData.get("capacity"),
        location: formData.get("location"),
        address: formData.get("address"),
        availability: formData.get("availability"),
        price_per_hour: formData.get("price_per_hour"),
        amenities: formData.get("amenities"),
        image: imageID,
      }
    );

    // revalidatePath("/", "layout");

    return {
      success: true,
      message: "New Room has been created successfully!",
    };
  } catch (error) {
    const errorMsg =
      error.response?.message || "An unexpected error has occured!";
    return {
      error: true,
      message: errorMsg,
    };
  }
}

export default createRoom;
