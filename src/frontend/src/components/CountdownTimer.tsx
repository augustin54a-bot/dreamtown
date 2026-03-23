import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  isDark: boolean;
}

export function CountdownTimer({ targetDate, isDark }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <span className="text-xs font-semibold" style={{ color: "#3CCB7A" }}>
        Time's up!
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 countdown-digit text-xs font-semibold">
      {timeLeft.days > 0 && (
        <>
          <span style={{ color: isDark ? "#6FA8FF" : "#4a7fd4" }}>
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span
            style={{ color: isDark ? "#7D86A6" : "#888" }}
            className="text-xs"
          >
            d
          </span>
          <span style={{ color: isDark ? "#7D86A6" : "#888" }}>:</span>
        </>
      )}
      <span style={{ color: isDark ? "#6FA8FF" : "#4a7fd4" }}>
        {String(timeLeft.hours).padStart(2, "0")}
      </span>
      <span style={{ color: isDark ? "#7D86A6" : "#888" }} className="text-xs">
        h
      </span>
      <span style={{ color: isDark ? "#7D86A6" : "#888" }}>:</span>
      <span style={{ color: isDark ? "#B98CFF" : "#8a6fd8" }}>
        {String(timeLeft.minutes).padStart(2, "0")}
      </span>
      <span style={{ color: isDark ? "#7D86A6" : "#888" }} className="text-xs">
        m
      </span>
      <span style={{ color: isDark ? "#7D86A6" : "#888" }}>:</span>
      <span style={{ color: isDark ? "#B98CFF" : "#8a6fd8" }}>
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
      <span style={{ color: isDark ? "#7D86A6" : "#888" }} className="text-xs">
        s
      </span>
    </div>
  );
}

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}
