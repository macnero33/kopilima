"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KopiLimaLogo, getWeeklyLogoVariant, type LogoVariant } from "@/components/kopi-lima-logo";

function HeroLogoContent() {
  const params = useSearchParams();
  const [variant, setVariant] = useState<LogoVariant>("solid");

  useEffect(() => {
    setVariant(getWeeklyLogoVariant(new Date(), params.get("isian") ?? undefined));
  }, [params]);

  return <KopiLimaLogo variant={variant} className="absolute inset-[20%] w-[60%]" />;
}

export function HeroLogo() {
  return (
    <Suspense fallback={<div className="absolute inset-[20%] w-[60%] animate-pulse rounded-[40%] bg-yellow/70" />}>
      <HeroLogoContent />
    </Suspense>
  );
}
