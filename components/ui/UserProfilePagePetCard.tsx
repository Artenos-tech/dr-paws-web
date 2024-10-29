import Image from "next/image";
import { StaticImageData } from "next/image";

interface PetCardProps {
  petData: {
    name: string;
    title: string;
    image: StaticImageData;
  };
}

const PetCard: React.FC<PetCardProps> = ({ petData }) => {
  const { name, title, image } = petData;

  return (
    <div className="rounded-3xl w-[140px] h-[200px] flex flex-col items-center justify-between bg-[#F6F0E8] border border-gray-300 shadow-lg">
      <div className="mt-4">
        <Image
          src={image}
          alt="Dr. Paws Logo"
          width={100}
          height={30}
          priority
          className="lg:block"
        />
      </div>
      <h2 className="text-lg font-semibold mt-2">{name}</h2>
      <div className="w-full bg-[#6AA2A5] py-2 rounded-b-3xl text-center text-white">
        <span className="text-sm">{title}</span>
      </div>
    </div>
  );
};

export default PetCard;
