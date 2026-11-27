import type { Metadata, Viewport } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-body" });
const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Kopi Lima — kopi enak buat nemenin nongkrong",
  description: "Kopi to go di depan kampus. Bikin kartu loyalty dan kumpulin lima stempel.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#FF6A3D" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body className={`${nunito.variable} ${baloo.variable}`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
