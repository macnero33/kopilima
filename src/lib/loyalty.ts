export const stampColors = ["#FF6A3D", "#FFC93C", "#3DBE8B", "#3D7BFF", "#FF7BB5"];

export type StampActionResult = {
  stamps: number;
  status: "stamped" | "cooldown" | "ready_to_redeem" | "redeemed" | "undo";
  retryAfterSeconds?: number;
};

export function canStamp(lastStampAt: Date | null, now: Date, cooldownMinutes: number) {
  if (!lastStampAt) return { allowed: true, retryAfterSeconds: 0 };
  const elapsed = now.getTime() - lastStampAt.getTime();
  const wait = cooldownMinutes * 60 * 1000;
  if (elapsed >= wait) return { allowed: true, retryAfterSeconds: 0 };
  return { allowed: false, retryAfterSeconds: Math.ceil((wait - elapsed) / 1000) };
}

export function nextStampCount(current: number) {
  if (current >= 5) return { stamps: 5, readyToRedeem: true };
  const stamps = Math.min(5, current + 1);
  return { stamps, readyToRedeem: stamps === 5 };
}

export function redeemStamps(current: number) {
  return current >= 5 ? { stamps: 0, redeemed: true } : { stamps: current, redeemed: false };
}
