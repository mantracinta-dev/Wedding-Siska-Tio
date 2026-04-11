"use client";

import type { CountdownState } from "@/features/invitation/useCountdown";

const UNITS: Array<{
  key: keyof CountdownState;
  label: string;
}> = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
];

type CountdownTickerProps = {
  countdown: CountdownState;
};

const formatValue = (value: number) => String(value).padStart(2, "0");

export default function CountdownTicker({ countdown }: CountdownTickerProps) {
  if (countdown.isPassed) {
    return (
      <p className="mt-5 rounded-2xl border border-sand-200 bg-white px-4 py-4 text-center text-sm font-semibold text-ink-700">
        Acara sudah dimulai. Sampai bertemu di lokasi.
      </p>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className="rounded-2xl border border-white shadow bg-white px-4 py-5 text-center"
        >
          <p className="text-2xl font-semibold text-ink-900">
            {formatValue(countdown[unit.key] as number)}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-500">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}
