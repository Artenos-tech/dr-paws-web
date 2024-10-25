import FaqList from "@/components/ui/FaqList";
import ReviewCard from "@/components/ui/ReviewCard";
import { reviewData } from "@/model/mockData";
const Home: React.FC = () => {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="bg-banner bg-cover bg-center bg-no-repeat h-96 w-full md:h-[500px] lg:h-[600px] min-h-[300px]"></div>
        <div className="w-full">
          <ReviewCard name={reviewData.name} review={reviewData.review} />
          <FaqList />
        </div>
      </main>
    </div>
  );
};
export default Home;
