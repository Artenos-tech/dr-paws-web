
import BookingDetailsWrapper from "@/components/ui/BookingDetailsWrapper";
import React from "react";

interface myBookingsProps {
  params: {
    appointmentId: string;
  };
}

const page: React.FC<myBookingsProps> = ({ params }) => {
  const { appointmentId } = params;
  console.log("id:",appointmentId);
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow px-8 md:px-32 lg:px-20 xl:px-40">
      <main className="w-full h-full  flex flex-col gap-[80px] my-5 row-start-2 items-center">
        <BookingDetailsWrapper appointmentId={appointmentId} />
      </main>
    </div>
  );
};

export default page;
