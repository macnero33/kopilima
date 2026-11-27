export const instant = false;

import { CustomerCard } from "@/components/customer-card";

export default async function CardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <main className="min-h-[calc(100vh-68px)] bg-cream px-5 py-8 text-coffee"><div className="mx-auto max-w-md"><CustomerCard token={token} /></div></main>;
}
