import { describe, expect, it } from "vitest";
import { canStamp, nextStampCount, redeemStamps } from "../src/lib/loyalty";

describe("aturan loyalty", () => {
  it("memblokir stempel ganda dalam 10 menit", () => {
    const now = new Date("2026-11-26T10:10:00Z");
    const result = canStamp(new Date("2026-11-26T10:05:00Z"), now, 10);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBe(300);
  });

  it("mengizinkan stempel setelah cooldown", () => {
    expect(canStamp(new Date("2026-11-26T09:55:00Z"), new Date("2026-11-26T10:05:00Z"), 10).allowed).toBe(true);
  });

  it("menandai stempel ke-5 siap ditebus", () => {
    expect(nextStampCount(4)).toEqual({ stamps: 5, readyToRedeem: true });
  });

  it("tebus hanya pada 5 stempel dan mengembalikan ke nol", () => {
    expect(redeemStamps(5)).toEqual({ stamps: 0, redeemed: true });
    expect(redeemStamps(3)).toEqual({ stamps: 3, redeemed: false });
  });
});
