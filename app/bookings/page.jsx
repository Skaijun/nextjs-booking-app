import Heading from "@/components/Heading";
// import BookedRoomCard from "@/components/BookedRoomCard";
import getUserBookings from "@/app/actions/getUserBookings.js";
import BookedRoomCard from "@/components/BookedRoomCard";

const BookingsPage = async () => {
  const bookings = await getUserBookings();
  return (
    <>
      <Heading title="My Bookings" />
      {!bookings || bookings.length === 0 ? (
        <p className="text-gray-600 mt-4">You have no bookings</p>
      ) : (
        bookings.map((booking) => (
          <BookedRoomCard key={booking.$id} booking={booking} />
        ))
      )}
    </>
  );
};

export default BookingsPage;
