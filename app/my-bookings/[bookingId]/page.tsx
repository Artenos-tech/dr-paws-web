import BookingDetails from "@/components/ui/BookingDetails";
import React from "react";

interface myBookingsProps {
  params: {
    bookingId: string;
  };
}

const page: React.FC<myBookingsProps> = ({ params }) => {
  const { bookingId } = params;
  console.log(bookingId[0])

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow px-8 md:px-32 lg:px-20 xl:px-40">
      <main className="w-full h-full  flex flex-col gap-[80px] my-5 row-start-2 items-center">
        <BookingDetails bookingId={bookingId} />
      </main>
    </div>
  );
};

export default page;
