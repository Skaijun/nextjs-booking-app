"use server";

import { createAdminClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getAllRooms() {
  try {
    const { databases } = await createAdminClient();

    // fetching rooms from appwrite db
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS
    );

    // revalidate the cache for this path to observe changes immediately
    // revalidatePath("/", "layout"); // TODO - GET WHY IT DOES`n WORK
    // Failed to get rooms Error: Route / used "revalidatePath /rooms" during render which is unsupported. To ensure revalidation is performed consistently it must always happen outside of renders and cached functions. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering
    // at getAllRooms (getAllRooms.js:18:19)
    // at async Home (page.jsx:6:17)
    // at resolveErrorDev (react-server-dom-webpack-client.browser.development.js:1792:63)
    // at getOutlinedModel (react-server-dom-webpack-client.browser.development.js:1283:22)
    // at parseModelString (react-server-dom-webpack-client.browser.development.js:1423:15)
    // at Array.eval (react-server-dom-webpack-client.browser.development.js:2119:18)
    // at JSON.parse (<anonymous>)

    return rooms;
  } catch (error) {
    console.log("Failed to get rooms", error);
    redirect("/error");
  }
}

export default getAllRooms;
