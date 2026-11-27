import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdminBearer } from "@/lib/admin-auth";
import { canStamp, nextStampCount, redeemStamps } from "@/lib/loyalty";
import { siteConfig } from "@/config/site";

const schema = z.object({
  action: z.enum(["stamp","redeem","undo","delete","search"]),
  token: z.string().min(16).max(64).optional(),
  query: z.string().trim().max(80).optional(),
});

export async function POST(request: Request) {
  const admin = await requireAdminBearer(request);
  if (!admin) return NextResponse.json({ error:"Login dulu, ya." }, { status:401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error:"Permintaan tidak valid." }, { status:400 });
  const supabase = getSupabaseAdmin();
  const input = parsed.data;

  if (input.action === "search") {
    let query = supabase.from("customers").select("id,token,name,phone,stamps,created_at").limit(20);
    if (input.query) {
      const safe = input.query.replace(/[%_]/g, (c) => `\\${c}`);
      query = query.or(`name.ilike.%${safe}%,phone.ilike.%${safe}%`);
    }
    const { data, error } = await query.order("created_at", { ascending:false });
    if (error) return NextResponse.json({ error:"Gagal cari pelanggan." }, { status:500 });
    const customers = data ?? [];
    if (!customers.length) return NextResponse.json({ customers:[] });
    const { data: logs } = await supabase
      .from("stamp_log")
      .select("customer_id,type,created_at")
      .in("customer_id", customers.map((customer) => customer.id))
      .order("created_at", { ascending:false })
      .limit(100);
    const historyByCustomer = Object.fromEntries(customers.map((customer) => [
      customer.id,
      (logs ?? []).filter((log) => log.customer_id === customer.id).slice(0, 4),
    ]));
    return NextResponse.json({ customers: customers.map((customer) => ({
      ...customer,
      history: historyByCustomer[customer.id] ?? [],
    })) });
  }

  if (!input.token) return NextResponse.json({ error:"Token pelanggan wajib ada." }, { status:400 });
  const { data: customer, error } = await supabase.from("customers").select("id,name,stamps").eq("token",input.token).maybeSingle();
  if (error || !customer) return NextResponse.json({ error:"QR tidak cocok dengan pelanggan." }, { status:404 });

  if (input.action === "delete") {
    const { error: delError } = await supabase.from("customers").delete().eq("id",customer.id);
    if (delError) return NextResponse.json({ error:"Gagal hapus pelanggan." }, { status:500 });
    return NextResponse.json({ deleted:true });
  }

  if (input.action === "stamp") {
    const { data: stampLogs } = await supabase.from("stamp_log").select("created_at").eq("customer_id",customer.id).eq("type","stamp").order("created_at",{ascending:false}).limit(1);
    const lastStamp = stampLogs?.[0] ? new Date(stampLogs[0].created_at) : null;
    const cooldown = canStamp(lastStamp, new Date(), siteConfig.loyalty.stampCooldownMinutes);
    if (!cooldown.allowed) return NextResponse.json({ error:`Belum boleh scan lagi. Tunggu ${Math.ceil(cooldown.retryAfterSeconds!/60)} menit.`, retryAfterSeconds:cooldown.retryAfterSeconds }, { status:429 });
    if (customer.stamps >= 5) return NextResponse.json({ error:"Kartu sudah punya 5 stempel. Tebus kopi gratis dulu.", stamps:customer.stamps }, { status:409 });
    const result = nextStampCount(customer.stamps);
    const { data: updated, error: updError } = await supabase
      .from("customers")
      .update({ stamps: result.stamps })
      .eq("id", customer.id)
      .eq("stamps", customer.stamps)
      .select();
    if (updError || !updated?.length) {
      return NextResponse.json({ error: "Data berubah saat diproses. Coba lagi." }, { status: 409 });
    }
    await supabase.from("stamp_log").insert({ customer_id:customer.id,type:"stamp",created_by:admin.id });
    return NextResponse.json({ name:customer.name, stamps:result.stamps, status:result.readyToRedeem ? "ready_to_redeem":"stamped" });
  }

  if (input.action === "redeem") {
    const result = redeemStamps(customer.stamps);
    if (!result.redeemed) return NextResponse.json({ error:"Belum cukup 5 stempel untuk ditebus." }, { status:409 });
    await supabase.from("customers").update({ stamps:0 }).eq("id",customer.id);
    await supabase.from("stamp_log").insert({ customer_id:customer.id,type:"redeem",created_by:admin.id });
    return NextResponse.json({ name:customer.name, stamps:0, status:"redeemed" });
  }

  if (input.action === "undo") {
    const { data: latest } = await supabase.from("stamp_log").select("id,type,created_at").eq("customer_id",customer.id).order("created_at",{ascending:false}).limit(1).maybeSingle();
    if (!latest) return NextResponse.json({ error:"Belum ada aksi yang bisa dibatalkan." }, { status:409 });
    const age = Date.now() - new Date(latest.created_at).getTime();
    if (age > 5*60*1000) return NextResponse.json({ error:"Batas undo sudah lewat (5 menit)." }, { status:409 });

    if (latest.type === "stamp") {
      await supabase.from("customers").update({ stamps:Math.max(0,customer.stamps-1) }).eq("id",customer.id);
    } else if (latest.type === "redeem") {
      await supabase.from("customers").update({ stamps:5 }).eq("id",customer.id);
    } else return NextResponse.json({ error:"Aksi terakhir sudah berupa undo." }, { status:409 });
    await supabase.from("stamp_log").insert({ customer_id:customer.id,type:"undo",created_by:admin.id });
    return NextResponse.json({ name:customer.name, status:"undo" });
  }

  return NextResponse.json({ error:"Aksi tidak dikenal." }, { status:400 });
}
