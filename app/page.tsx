import Button from "@/components/Button";
import ClinicItem from "@/components/ClinicItem";
import { clinicItems } from "@/model/mockData";

export default function Home() {
  return (
    <div className="w-full">
      <main>
        <h1>Button</h1>
        {/* Sample button */}
        <Button text="Book demo" background="bg-secondary-1" />
        <Button text="Book demo" background="bg-primary-1" />

        <h1>Check card the places we call home</h1>
        <div className="p-5 flex flex-wrap gap-3">
          {clinicItems.map((clinic, clinicIndex) => (
            <ClinicItem key={clinicIndex} clinic={clinic} background="bg-tint" />
          ))}
        </div>
      </main>
    </div>
  );
}
