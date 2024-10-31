import { bannerItems } from "@/model/mockData";
import BannerCard from "./BannerCard";

const BannerList = () => {
  return (
    <div className="gap-3 md:gap-5 flex my-4">
      {bannerItems.map((banItem, banIndex) => (
        <BannerCard key={banIndex} banItem={banItem} />
      ))}
    </div>
  );
};

export default BannerList;
