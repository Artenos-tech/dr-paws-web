import Button from "@/components/ui/Button";
import ClinicItem from "@/components/ui/ClinicItem";
import DescriptionCardList from "@/components/ui/DescriptionCardList";
import { clinicItems } from "@/model/mockData";

export default function Home() {
  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <main>
        <h1>Button</h1>
        {/* Sample button */}
        <Button text="Book demo" background="bg-secondary-1" />
        <Button text="Book demo" background="bg-primary-1" />
        <Button text="Book a Member" background="bg-accent" />
        <Button text="Book a Member" background="bg-secondary-2" />

        {/* Clinic items */}
        <h1>Check card the places we call home</h1>
        <div className="p-5 flex flex-wrap gap-3">
          {clinicItems.map((clinic, clinicIndex) => (
            <ClinicItem
              key={clinicIndex}
              clinic={clinic}
              background="bg-tint"
            />
          ))}
        </div>

        {/* Description Card */}
        <DescriptionCardList />
      </main>
    </div>
  );
}
