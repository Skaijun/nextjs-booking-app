"use client";

import deleteRoom from "@/app/actions/deleteRoom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const DeleteRoomButton = ({ roomID }) => {
  const handleDeleteRoom = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!isConfirmed) {
      return null;
    }

    const response = await deleteRoom(roomID);

    if (response.success) {
      toast.success(response.message);
    }

    if (response.error) {
      toast.error(response.message);
    }
  };

  return (
    <button
      onClick={handleDeleteRoom}
      className="bg-red-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-red-700">
      <FaTrash className="inline mr-1" /> Delete
    </button>
  );
};

export default DeleteRoomButton;
