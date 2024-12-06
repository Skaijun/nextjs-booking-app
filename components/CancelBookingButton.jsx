"use client";

import cancelBooking from "@/app/actions/cancelBooking";
import { toast } from "react-toastify";

const CancelBookingButton = ({ bookingId }) => {
  const handleCancelBooking = async (id) => {
    const result = await cancelBooking(id);

    if (result.error) {
      toast.error(result?.message);
    }

    if (result.success) {
      toast.success(result?.message);
    }
  };
  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700"
      onClick={() => handleCancelBooking(bookingId)}>
      Cancel Booking
    </button>
  );
};

export default CancelBookingButton;
