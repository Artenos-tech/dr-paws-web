export type Clinic = {
  name: string
  phone: string
}

export type ClinicRegion = {
  region: string
  clinics: Clinic[]
}

export const clinicLocations: ClinicRegion[] = [
  {
    region: "Bangalore",
    clinics: [
      { name: "Indiranagar Clinic", phone: "+91 9606994627" },
      { name: "RMV Clinic", phone: "+91 7204996899" },
      { name: "HSR Clinic", phone: "+91 7204996902" },
      { name: "Thanisandra Clinic", phone: "+91 9108467651" },
      { name: "Jayanagar Clinic", phone: "+91 9108467650" },
      { name: "HRBR Layout Clinic", phone: "+91 9187224115" },
      { name: "Rajajinagar Clinic", phone: "+91 9187224112" },
    ],
  },
  {
    region: "Hyderabad",
    clinics: [
      { name: "Kokapet Clinic", phone: "+91 8296895487" },
      { name: "Kondapur Clinic", phone: "+91 8296895488" },
    ],
  },
  {
    region: "Vet-At-Home",
    clinics: [{ name: "Vet-At-Home", phone: "+91 9740141212" }],
  },
]
