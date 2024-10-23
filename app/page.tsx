import Faq from "@/Components/Faq";
import Image from "next/image";
import { mockItems } from "@/model/mockData";
import { mock } from "node:test";
const Home: React.FC = () => {
  return (
    <div>
      <main>
        <div>
          {mockItems.map((faq, faqIndex) => (
            <Faq key={faqIndex} heading={faq.heading} items={faq.qaList} />
          ))}
        </div>
      </main>
    </div>
  );
};
export default Home;
