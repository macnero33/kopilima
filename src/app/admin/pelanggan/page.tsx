import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase-server";
import PelangganClient from "./pelanggan-client";

export default async function PelangganPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return <PelangganClient />;
}
