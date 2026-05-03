'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HRS', value: timeLeft.hours },
    { label: 'MIN', value: timeLeft.minutes },
    { label: 'SEC', value: timeLeft.seconds },
  ];

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span
              style={{
                fontFamily: 'var(--font-bebas), serif',
                fontSize: '3.5rem',
                lineHeight: 1,
                color: 'inherit',
              }}
            >
              {pad(unit.value)}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-nunito), sans-serif',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'inherit',
                opacity: 0.7,
              }}
            >
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '3rem', opacity: 0.6, color: 'inherit' }}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
