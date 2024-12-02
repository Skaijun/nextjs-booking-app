import Link from "next/link";
import Image from "next/image";

import Heading from "@/components/Heading";
import BookingForm from "@/components/BookingForm";
import { FaChevronLeft } from "react-icons/fa";
import rooms from "@/data/rooms.json";

const RoomPage = async ({ params }) => {
  const { id } = await params;
  const room = rooms.find((room) => room.$id === id);

  if (!room) {
    return <Heading title="Room not Found!" />;
  }

  return (
    <>
      <Heading title={room.name} />
      <div className="bg-white shadow rounded-lg p-6">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
          <FaChevronLeft className="mr-1 inline" />
          <span className="ml-2">Back to Rooms</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <Image
            src={`/images/rooms/${room.image}`}
            width={400}
            height={200}
            alt="Grand Conference Hall"
            className="w-full sm:w-1/3 h-64 object-cover rounded-lg"
          />

          <div className="mt-4 sm:mt-0 sm:flex-1">
            <p className="text-gray-600 mb-4">{room.description}</p>

            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-gray-800">Size:&nbsp;</span>
                {room.sqft}
                sq ft
              </li>
              <li>
                <span className="font-semibold text-gray-800">
                  Availability:&nbsp;
                </span>
                {room.availability}
              </li>
              <li>
                <span className="font-semibold text-gray-800">
                  Price:&nbsp;
                </span>
                ${room.price_per_hour}/hour
              </li>
              <li>
                <span className="font-semibold text-gray-800">
                  Address:&nbsp;
                </span>
                {room.address}
              </li>
            </ul>
          </div>
        </div>

        <BookingForm />
      </div>
    </>
  );
};

export default RoomPage;
