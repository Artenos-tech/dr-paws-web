import Payment from '@/components/ui/Payment';

export default function Page() {
  return (
    <>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
        <Payment amount={1} />
      </div>
    </>
  );
}
