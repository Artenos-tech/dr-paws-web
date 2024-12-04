import { bannerItems } from "@/model/mockData";
import BannerCard from "./BannerCard";

interface BannerListProps{
  openLoginModal: ((val: string) => void) | undefined;
}

const BannerList: React.FC<BannerListProps> = ({openLoginModal}) => {
  return (
    <div className="gap-3 md:gap-5 flex my-4">
      {bannerItems.map((banItem, banIndex) => (
        <BannerCard key={banIndex} banItem={banItem} openLoginModal={openLoginModal}/>
      ))}
    </div>
  );
};

export default BannerList;
