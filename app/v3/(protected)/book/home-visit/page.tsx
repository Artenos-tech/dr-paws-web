import HomeVisitFlow from "@/components/v3/booking/HomeVisitFlow"

export default function HomeVisitPage({
  searchParams,
}: {
  searchParams: { couponCode?: string }
}) {
  return <HomeVisitFlow couponCode={searchParams.couponCode} />
}
