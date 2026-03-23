import { Bell, X } from "lucide-react";
import type { SurpriseEvent } from "../types";

interface NotificationsProps {
  events: SurpriseEvent[];
  isDark: boolean;
  dismissed: string[];
  onDismiss: (id: string) => void;
}

export function Notifications({
  events,
  isDark,
  dismissed,
  onDismiss,
}: NotificationsProps) {
  const now = new Date();

  const alerts = events
    .filter((e) => !e.isCompleted && !dismissed.includes(e.id))
    .map((e) => {
      const eventDate = new Date(e.eventDate);
      const diffMs = eventDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return null;
      if (diffDays === 0)
        return {
          id: e.id,
          msg: `🎉 Today is the day! "${e.title}" is happening now!`,
          urgent: true,
        };
      if (diffDays <= 7)
        return {
          id: e.id,
          msg: `🎊 ${diffDays} day${diffDays === 1 ? "" : "s"} left until "${e.title}"!`,
          urgent: diffDays <= 2,
        };
      return null;
    })
    .filter(Boolean) as { id: string; msg: string; urgent: boolean }[];

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="fade-in flex items-center justify-between gap-3 rounded-xl px-4 py-3"
          style={{
            background: alert.urgent
              ? isDark
                ? "rgba(210, 124, 255, 0.18)"
                : "rgba(180, 100, 255, 0.12)"
              : isDark
                ? "rgba(111, 168, 255, 0.15)"
                : "rgba(85, 140, 255, 0.10)",
            border: `1px solid ${
              alert.urgent
                ? isDark
                  ? "rgba(210, 124, 255, 0.35)"
                  : "rgba(180, 100, 255, 0.3)"
                : isDark
                  ? "rgba(111, 168, 255, 0.3)"
                  : "rgba(85, 140, 255, 0.25)"
            }`,
          }}
          data-ocid="notification.toast"
        >
          <div className="flex items-center gap-2">
            <Bell
              size={15}
              className="shrink-0"
              style={{ color: alert.urgent ? "#D27CFF" : "#6FA8FF" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
            >
              {alert.msg}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(alert.id)}
            className="shrink-0 rounded-full p-1 transition-all hover:opacity-70"
            aria-label="Dismiss notification"
            data-ocid="notification.close_button"
          >
            <X size={14} style={{ color: isDark ? "#AEB6D0" : "#666" }} />
          </button>
        </div>
      ))}
    </div>
  );
}
