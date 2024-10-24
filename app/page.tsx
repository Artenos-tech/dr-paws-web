import FaqList from "@/components/ui/FaqList";
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
