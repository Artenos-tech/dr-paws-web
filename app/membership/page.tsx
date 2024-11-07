import React from "react";
import Image, { StaticImageData } from "next/image";
import MembershipDesc from "@/public/assets/images/Membership/MembershipDesc.png";

const Membership = () => {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="w-full  flex flex-col gap-8 row-start-2 items-center ">
        <div className="w-[80%] flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 my-16">
          <div className="flex-shrink-0 w-full  lg:w-auto">
            <Image
              src={MembershipDesc}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
          <div className="flex items-center justify-center w-full lg:items-start lg:justify-center">
            <div className="text-center lg:text-left w-full lg:w-[377px] h-auto">
              <h1 className="text-3xl lg:text-[48px] mb-4 leading-tight">
                Great value care, whatever your pet needs
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-700 px-1">
                Our memberships are designed to provide the convenience,
                security, and value pet-parents of today expect. Explore our
                plans to discover the one that fits your pet's needs.
              </p>
            </div>
          </div>
        </div>

        
      </main>
    </div>
  );
};

export default Membership;
