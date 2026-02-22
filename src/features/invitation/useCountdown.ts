"use client";

import { useEffect, useMemo, useState } from "react";

export type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
};

const clamp = (value: number) => (value < 0 ? 0 : value);

export function useCountdown(targetIso: string): CountdownState {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [state, setState] = useState<CountdownState>(() => ({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  }));

  useEffect(() => {
    if (!Number.isFinite(target)) return;

    const update = () => {
      const now = Date.now();
      const diff = target - now;
      const isPassed = diff <= 0;
      const totalSeconds = clamp(Math.floor(diff / 1000));

      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setState({ days, hours, minutes, seconds, isPassed });
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  return state;
}
