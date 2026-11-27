import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kopi Lima — Loyalty Card",
    short_name: "Kopi Lima",
    description: "Kartu loyalty Kopi Lima",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF4E0",
    theme_color: "#FF6A3D",
    icons: [{ src:"/logo.svg", sizes:"any", type:"image/svg+xml", purpose:"any" }],
  };
}
