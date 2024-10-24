import CircleImageCard from "@/components/ui/CircleImageCard";
import { circleImageList } from "@/model/mockData";

export default function Home() {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="bg-banner bg-cover  bg-no-repeat h-96 w-screen md:h-[500px] lg:h-[600px] min-h-[300px]"></div>
        <div className="flex items-center gap-3 mx-auto">
          {" "}
          {circleImageList.map((cirImg, cirIndex) => (
            <CircleImageCard key={cirIndex} cirImg={cirImg} />
          ))}
        </div>
      </main>
    </div>
  );
}
