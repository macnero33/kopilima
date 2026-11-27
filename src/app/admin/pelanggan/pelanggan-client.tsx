"use client";

import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type HistoryItem = { type:"stamp"|"redeem"|"undo"; created_at:string };
type Customer={id:string;token:string;name:string;phone:string|null;stamps:number;created_at:string;history:HistoryItem[]};

export default function PelangganClient(){
 const [customers,setCustomers]=useState<Customer[]>([]); const [query,setQuery]=useState(""); const [message,setMessage]=useState("");
 const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
 const [qrDataUrl, setQrDataUrl] = useState("");
 const call=useCallback(async function(action:"search"|"redeem"|"undo"|"delete", token?:string){
  const supabase=getSupabaseBrowser(); const {data:{session}}=await supabase.auth.getSession(); if(!session){setMessage("Sesi habis. Login ulang.");return;}
  const res=await fetch("/api/admin/actions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${session.access_token}`},body:JSON.stringify({action,query,token})}); const data=await res.json(); if(!res.ok){setMessage(data.error);return;}
  if(action==="search") setCustomers(data.customers||[]); else setMessage(action==="delete"?"Pelanggan dihapus.":"Aksi berhasil.");
 },[query]);
 useEffect(()=>{
  let active=true;
  async function loadInitial(){
   const supabase=getSupabaseBrowser();
   const {data:{session}}=await supabase.auth.getSession();
   if(!session||!active)return;
   const res=await fetch("/api/admin/actions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${session.access_token}`},body:JSON.stringify({action:"search",query:""})});
   const data=await res.json();
   if(active) setCustomers(data.customers||[]);
  }
  void loadInitial();
  return ()=>{active=false};
 },[]);

 const generateQr = async (token: string) => {
  try {
   const url = `${window.location.origin}/kartu/${token}`;
   const dataUrl = await QRCode.toDataURL(url, { width: 260, margin: 2, color: { dark: "#2B1B14", light: "#FFF4E0" } });
   setQrDataUrl(dataUrl);
  } catch {
   setQrDataUrl("");
  }
 };

 const openCard = (customer: Customer) => {
  setSelectedCustomer(customer);
  generateQr(customer.token);
 };

 const closeCard = () => {
  setSelectedCustomer(null);
  setQrDataUrl("");
 };

 const copyLink = (token: string) => {
  const url = `${window.location.origin}/kartu/${token}`;
  navigator.clipboard.writeText(url).then(() => {
   setMessage("Link kartu disalin ke clipboard.");
  });
 };

 return (
  <>
   <main className="min-h-screen bg-cream px-5 py-8 text-coffee">
    <div className="mx-auto max-w-2xl">
     <h1 className="font-display text-4xl font-black">Pelanggan</h1>
     <div className="mt-5 flex gap-2">
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari nama / WhatsApp" className="min-w-0 flex-1 rounded-xl border-2 border-coffee/20 bg-white/70 px-4 py-3"/>
      <button onClick={()=>call("search")} className="rounded-xl bg-coffee px-4 py-3 font-black text-cream">Cari</button>
     </div>
     {message&&<p className="mt-4 rounded-xl bg-yellow/60 p-3 font-black">{message}</p>}
     <div className="mt-5 space-y-3">
      {customers.map(c=>(
       <article key={c.id} className="rounded-2xl border-2 border-coffee/10 bg-white/70 p-4">
        <div className="flex items-start justify-between gap-3">
         <div>
          <h2 className="text-xl font-black">{c.name}</h2>
          <p className="text-sm opacity-70">{c.phone||"Tanpa WhatsApp"} · {c.stamps}/5 stempel</p>
         </div>
         <strong className="rounded-full bg-yellow px-3 py-1">{c.stamps}</strong>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
         <button onClick={()=>call("redeem",c.token)} className="rounded-lg bg-green px-3 py-2 text-sm font-black">Tebus</button>
         <button onClick={()=>call("undo",c.token)} className="rounded-lg bg-blue px-3 py-2 text-sm font-black text-cream">Undo</button>
         <button onClick={()=>openCard(c)} className="rounded-lg bg-orange px-3 py-2 text-sm font-black">Lihat Kartu</button>
         <button onClick={()=>{if(confirm(`Hapus ${c.name}?`)) call("delete",c.token)}} className="rounded-lg bg-pink px-3 py-2 text-sm font-black">Hapus</button>
        </div>
        <ul className="mt-3 border-t border-coffee/10 pt-2 text-xs font-bold">
         {c.history.map((item,index)=><li key={index}>{item.type} · {new Date(item.created_at).toLocaleString("id-ID")}</li>)}
        </ul>
       </article>
      ))}
     </div>
    </div>
   </main>

   {selectedCustomer && qrDataUrl && (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={closeCard}>
     <div className="bg-cream rounded-2xl p-6 border-2 border-coffee max-w-md w-full mx-4" onClick={(e)=>e.stopPropagation()}>
      <h3 className="font-display text-2xl font-black mb-1">Kartu Loyalty</h3>
      <p className="text-sm font-bold mb-4">{selectedCustomer.name}</p>
      <div className="flex flex-col items-center gap-3 mb-4">
       <img src={qrDataUrl} alt="QR Kartu" className="rounded-xl bg-cream p-2" />
       <p className="text-sm text-coffee/75 break-all">{window.location.origin}/kartu/{selectedCustomer.token}</p>
      </div>
      <div className="flex gap-2">
       <button onClick={()=>copyLink(selectedCustomer.token)} className="flex-1 rounded-xl bg-coffee px-4 py-3 font-black text-cream">Salin Link</button>
       <button onClick={closeCard} className="rounded-xl border-2 border-coffee px-4 py-3 font-black">Tutup</button>
      </div>
     </div>
    </div>
   )}
  </>
 );
}