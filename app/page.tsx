import FaqList from "@/components/ui/FaqList";
import ReviewCard from "@/components/ui/ReviewCard";
import { reviewData } from "@/model/mockData";
const Home: React.FC = () => {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca border">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-3/4">
        <div className="w-full">
          <ReviewCard name={reviewData.name} review={reviewData.review} />
          <FaqList />
        </div>
      </main>
    </div>
  );
};
export default Home;
