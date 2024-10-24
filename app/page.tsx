import CircleImageCard from "@/components/ui/CircleImageCard";
import MembershipCard from "@/components/ui/MembershipCard";
import OutlineButton from "@/components/ui/OutlineButton";
import { circleImageList, membershipDataList } from "@/model/mockData";

export default function Home() {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="bg-banner bg-cover  bg-no-repeat h-96 w-screen md:h-[500px] lg:h-[600px] min-h-[300px]"></div>
        <div className="w-full max-w-[1000px] mx-auto my-10">
          <div className="flex items-center gap-3">
            {" "}
            {circleImageList.map((cirImg, cirIndex) => (
              <CircleImageCard key={cirIndex} cirImg={cirImg} />
            ))}
          </div>

          <OutlineButton outlineBtnText="Edit Profile" />

          {membershipDataList.map((membershipData, index) => (
            <MembershipCard key={index} membershipData={membershipData} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
