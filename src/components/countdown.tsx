"use client";

import { useEffect, useState } from "react";
import { endsAt, startsAt } from "@/lib/party";
import styles from "./countdown.module.css";

const start = new Date(startsAt).getTime();
const end = new Date(endsAt).getTime();

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "days", value: Math.floor(s / 86400) },
    { label: "hours", value: Math.floor((s % 86400) / 3600) },
    { label: "minutes", value: Math.floor((s % 3600) / 60) },
    { label: "seconds", value: s % 60 },
  ];
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now !== null && now >= end) {
    return <p className={styles.status}>That&rsquo;s a wrap. See you at Havoc.</p>;
  }

  if (now !== null && now >= start) {
    return <p className={styles.status}>It&rsquo;s on right now. Get to Beddoe.</p>;
  }

  return (
    <div className={styles.clock} role="timer" aria-label="Time until the party starts">
      {parts(now === null ? 0 : start - now).map(({ label, value }) => (
        <div key={label} className={styles.unit}>
          <span className={styles.value}>
            {now === null ? "--" : String(value).padStart(2, "0")}
          </span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}
