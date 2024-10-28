import { bannerItems } from "@/model/mockData";
import BannerCard from "./BannerCard";

const BannerList = () => {
  return (
    <div className="gap-3 md:gap-5 lg:gap-8 flex mt-4 md:mt-6 lg:mt-8">
      {bannerItems.map((banItem, banIndex) => (
        <BannerCard key={banIndex} banItem={banItem} />
      ))}
    </div>
  );
};

export default BannerList;
