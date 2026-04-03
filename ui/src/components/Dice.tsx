"use client";
import React from "react";
import { classNames } from "@/lib/utils";

const PIP_MAP: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function DiceFace({ value, rolling, label }: { value: number; rolling: boolean; label: string }) {
  const pips = PIP_MAP[value] || [];
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={classNames(
          "dice-shell",
          "relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
          "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]",
          rolling ? "animate-dice-roll" : "transition-transform duration-500"
        )}
      >
        <div className="absolute inset-2 rounded-xl bg-[linear-gradient(160deg,rgba(12,14,25,0.9),rgba(6,8,16,0.9))] border border-white/5" />
        <div className="absolute inset-3 grid grid-cols-3 gap-2 place-items-center">
          {Array.from({ length: 9 }).map((_, idx) => (
            <span
              key={idx}
              className={classNames(
                "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-opacity",
                pips.includes(idx) ? "bg-brand-amber/90 shadow-[0_0_10px_rgba(251,191,36,0.6)]" : "opacity-0"
              )}
            />
          ))}
        </div>
      </div>
      <span className="text-xs uppercase tracking-[0.3em] text-white/40">{label}</span>
    </div>
  );
}

export function DicePair({
  dieOne,
  dieTwo,
  rolling,
}: {
  dieOne: number;
  dieTwo: number;
  rolling: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <DiceFace value={dieOne} rolling={rolling} label="Die One" />
      <DiceFace value={dieTwo} rolling={rolling} label="Die Two" />
    </div>
  );
}
