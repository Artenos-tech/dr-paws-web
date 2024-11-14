import { bannerItems } from "@/model/mockData";
import BannerCard from "./BannerCard";

interface BannerListProps{
  openContactModal: () => void;
}

const BannerList: React.FC<BannerListProps> = ({openContactModal}) => {
  return (
    <div className="gap-3 md:gap-5 flex my-4">
      {bannerItems.map((banItem, banIndex) => (
        <BannerCard key={banIndex} banItem={banItem} openContactModal={openContactModal}/>
      ))}
    </div>
  );
};

export default BannerList;
