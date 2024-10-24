import Faq from "@/components/ui/FaqItem";
import Image from "next/image";
import { FaqData, reviewData } from "@/model/mockData";
import { mock } from "node:test";
import ReviewCard from "@/components/ui/ReviewCard";
import FaqList from "@/components/ui/FaqList";
import Footer from "@/components/layout/Footer";
const Home: React.FC = () => {
  return (
    <div>
      <main>
        <div>
          {/* <ReviewCard name={reviewData.name} review={reviewData.review} /> */}
          <FaqList />
        </div>
      </main>
    </div>
  );
};
export default Home;
{
  /* <ReviewCard name={reviewData.name} review={reviewData.review} /> */
}
