export default function SupportPage() {
  const support = {
    email: "admin@drpaws.care",
    // phoneNumber: "",
    clinics: [
      {
        clinicName: "Dr. Paws, Indiranagar",
        clinicContact: "+91 9606994627",
      },
      {
        clinicName: "Dr. Paws, RMV (Dollars Colony)",
        clinicContact: "+91 7204996899",
      },
      {
        clinicName: "Dr. Paws, HSR Layout",
        clinicContact: "+91 7204996902"
      }
    ],
  };

  return (
    <main className="max-w-xl mx-auto p-6 font-sans text-gray-900 bg-white">
      <h1 className="text-2xl font-bold mb-4">Support</h1>

      <p className="mb-2">For any assistance, please contact us at:</p>

      <p className="mb-1">
        Email:{" "}
        <a href={`mailto:${support.email}`} className="text-blue-600 underline">
          {support.email}
        </a>
      </p>

      {/* <p className="mb-4">
        Phone:{" "}
        <a href={`tel:${support.phoneNumber}`} className="text-blue-600 underline">
          {support.phoneNumber}
        </a>
      </p> */}

      <h2 className="text-xl font-semibold mb-2">Clinic Contacts</h2>

      <ul className="space-y-3">
        {support.clinics.map((clinic, index) => (
          <li key={index}>
            <div className="font-medium">{clinic.clinicName}</div>
            <div className="text-gray-700">{clinic.clinicContact}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}