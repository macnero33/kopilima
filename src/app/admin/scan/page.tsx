import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase-server";
import ScanClient from "./scan-client";

export default async function ScanPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return <ScanClient />;
}
