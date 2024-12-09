import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MedicalHistoryType } from "./PetMedicalHistory";

interface FilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  currentCategory: "diagnosticReports" | "scansAndXRays" | "vaccines";
  petMedicalHistory: MedicalHistoryType | null;
}

interface FileType {
  name: string;
  type: string;
  size: number;
  content: string;
}

const PetFilePreview: React.FC<FilePreviewProps> = ({
  isOpen,
  onClose,
  currentCategory,
  currentIndex,
  petMedicalHistory,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const appElement = document.getElementById("__next");
    if (appElement) {
      Modal.setAppElement(appElement);
    } else {
      console.warn("ReactModal: App element with id '__next' not found.");
    }
  }, []);

  useEffect(() => {
    if (petMedicalHistory) {
      const categoryFiles = petMedicalHistory[currentCategory];

      if (Array.isArray(categoryFiles)) {
        setFiles(categoryFiles)
      }
    }
  }, [petMedicalHistory, currentCategory, currentIndex]);

  if (!isMounted || files.length === 0) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="mt-20 mb-5 mx-auto px-4 bg-transparent border-none outline-none rounded-xl shadow-lg w-full max-w-4xl z-50 h-[600px]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="flex flex-col relative">
        <button
          className="absolute top-0 right-0 text-white z-10 hover:text-white-700 transition-colors"
          aria-label="Close modal"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        <div className="flex flex-col items-center overflow-hidden mt-3">
          <div className="relative px-8 max-w-screen-xl w-full mx-auto">
            <button className="custom-swiper-button-prev absolute -left-[18px] top-1/2 -translate-y-1/2 rounded-full p-2 transition-colors">
              <ChevronLeft size={42} className="text-white" />
            </button>
            <button className="custom-swiper-button-next absolute -right-[18px] top-1/2 -translate-y-1/2 rounded-full p-2  transition-colors">
              <ChevronRight size={42} className="text-white" />
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".custom-swiper-button-prev",
                nextEl: ".custom-swiper-button-next",
              }}
              spaceBetween={30}
              slidesPerView={1}
              initialSlide={currentIndex}
              breakpoints={{
                640: { slidesPerView: 1 },
                972: { slidesPerView: 1 },
                1280: { slidesPerView: 1 },
              }}
              className="w-full"
              style={{ zIndex: 0 }}
            >
              {files.map((file, index) => (
                <SwiperSlide
                  key={index}
                  className="flex items-center justify-center"
                >
                  {file.type === "application/pdf" ? (
                    <iframe
                      src={file.content}
                      title={file.name}
                      className="w-full h-[550px] text-white rounded-lg"
                    ></iframe>
                  ) : (
                    <div className="text-red-500">
                      Unsupported file type: {file.type}
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="mt-2 text-center text-sm text-gray-500">
          {files[currentIndex]?.name}
        </div>
      </div>
    </Modal>
  );
};

export default PetFilePreview;
