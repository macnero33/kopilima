import { siteConfig } from "@/config/site";

export type LogoVariant = "solid" | "garis" | "titik" | "blok" | "doodle";

const variants: LogoVariant[] = ["solid", "garis", "titik", "blok", "doodle"];

export function getWeeklyLogoVariant(date = new Date(), forced?: string): LogoVariant {
  if (forced && variants.includes(forced as LogoVariant)) return forced as LogoVariant;
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const day = (start.getUTCDay() + 6) % 7;
  start.setUTCDate(start.getUTCDate() - day);
  const diff = date.getTime() - start.getTime();
  const week = Math.floor(diff / 604800000) + 1;
  return variants[(week - 1) % variants.length];
}

export function KopiLimaLogo({ variant, className = "" }: { variant?: LogoVariant; className?: string }) {
  const fillVariant = variant ?? "solid";
  return (
    <div className={`relative inline-grid place-items-center ${className}`} aria-label={siteConfig.name}>
      <svg viewBox="0 0 320 210" role="img" className="h-full w-full" aria-hidden="true">
        <defs>
          <clipPath id="kopi-lima-silhouette">
            {/* Siluet tetap: huruf LIMA blocky dan titik kotak miring di atas A. */}
            <path d="M20 175V55h42v82h48v38H20zm106 0V55h42v38h34V55h42v120h-42v-44h-34v44h-42zm131-120h43l-22 120h-45l24-120z" />
            <path d="M205 28l34-18 23 43-34 18-23-43z" transform="rotate(35 233 40)" />
          </clipPath>
        </defs>
        <g clipPath="url(#kopi-lima-silhouette)">
          {fillVariant === "solid" && <rect width="320" height="210" fill="#FF6A3D" />}
          {fillVariant === "garis" && <><rect width="320" height="210" fill="#FFF4E0" />{[0,20,40,60,80,100,120,140,160,180,200].map(y => <rect key={y} y={y} width="320" height="8" fill="#2B1B14" />)}</>}
          {fillVariant === "titik" && <><rect width="320" height="210" fill="#FFF4E0" />{Array.from({length: 80}, (_, i) => <circle key={i} cx={(i%10)*34+14} cy={Math.floor(i/10)*34+14} r="8" fill={["#FF6A3D","#FFC93C","#3DBE8B","#3D7BFF","#FF7BB5"][i%5]} />)}</>}
          {fillVariant === "blok" && <><rect width="64" height="210" fill="#FF6A3D" /><rect x="64" width="64" height="210" fill="#FFC93C" /><rect x="128" width="64" height="210" fill="#3DBE8B" /><rect x="192" width="64" height="210" fill="#3D7BFF" /><rect x="256" width="64" height="210" fill="#FF7BB5" /></>}
          {fillVariant === "doodle" && <><rect width="320" height="210" fill="#FFF4E0" /><path d="M-20 170Q40 90 100 170T220 170T340 170" fill="none" stroke="#FF6A3D" strokeWidth="18" /><circle cx="60" cy="48" r="18" fill="#3DBE8B" /><circle cx="270" cy="62" r="24" fill="#3D7BFF" /></>}
        </g>
      </svg>
    </div>
  );
}
