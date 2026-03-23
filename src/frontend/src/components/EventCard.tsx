import { Eye, EyeOff, Lock, MapPin, Trophy, Users } from "lucide-react";
import { useState } from "react";
import type { SurpriseEvent } from "../types";
import { getEventGradient, getEventIcon } from "../utils/eventUtils";
import { CountdownTimer } from "./CountdownTimer";

interface EventCardProps {
  event: SurpriseEvent;
  secretMode: boolean;
  isDark: boolean;
  onReveal: (event: SurpriseEvent) => void;
  onEdit: (event: SurpriseEvent) => void;
  compact?: boolean;
}

export function EventCard({
  event,
  secretMode,
  isDark,
  onReveal,
  onEdit,
  compact,
}: EventCardProps) {
  const [showSecret, setShowSecret] = useState(false);
  const isHidden = secretMode && !event.isRevealed && !showSecret;
  const eventDate = new Date(event.eventDate);
  const isPast = eventDate < new Date();
  const gradient = getEventGradient(event.eventType);

  const cardStyle = isDark
    ? {
        background: "rgba(45, 55, 75, 0.45)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.10)",
      }
    : {
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.08)",
      };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
      style={{
        ...cardStyle,
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.35)"
          : "0 4px 20px rgba(0,0,0,0.1)",
      }}
      data-ocid="event.card"
    >
      <div className="h-1.5 w-full" style={{ background: gradient }} />

      <div className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getEventIcon(event.eventType)}</span>
            <div>
              <h3
                className={`font-semibold leading-tight ${compact ? "text-sm" : "text-base"}`}
                style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
              >
                {event.title}
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: isDark ? "#7D86A6" : "#888" }}
              >
                {eventDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {" · "}
                {eventDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {event.password && (
              <Lock
                size={13}
                style={{ color: isDark ? "#B98CFF" : "#8a6fd8" }}
              />
            )}
            {event.isCompleted && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(60, 203, 122, 0.2)",
                  color: "#3CCB7A",
                  border: "1px solid rgba(60,203,122,0.3)",
                }}
              >
                ✓ Done
              </span>
            )}
          </div>
        </div>

        {!event.isCompleted && !isPast && (
          <div className="mb-2">
            <CountdownTimer targetDate={event.eventDate} isDark={isDark} />
          </div>
        )}

        <div className="flex items-start gap-1 mb-2">
          <MapPin
            size={12}
            className="mt-0.5 shrink-0"
            style={{ color: isDark ? "#6FA8FF" : "#4a7fd4" }}
          />
          <p
            className={`text-xs leading-relaxed ${isHidden ? "secret-blur" : ""}`}
            style={{ color: isDark ? "#AEB6D0" : "#555" }}
          >
            {event.location}
          </p>
        </div>

        {!compact && (
          <div
            className={`rounded-lg px-3 py-2 mb-3 text-xs leading-relaxed ${isHidden ? "secret-blur" : ""}`}
            style={{
              background: isDark
                ? "rgba(10, 15, 25, 0.35)"
                : "rgba(111, 168, 255, 0.08)",
              border: isDark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(111,168,255,0.15)",
              color: isDark ? "#AEB6D0" : "#444",
            }}
          >
            <span
              className="font-medium mr-1"
              style={{ color: isDark ? "#B98CFF" : "#8a6fd8" }}
            >
              🔒
            </span>
            {isHidden ? "Secret message hidden" : event.secretMessage}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Users size={12} style={{ color: isDark ? "#7D86A6" : "#999" }} />
            <div className="flex -space-x-1">
              {event.guests.slice(0, 3).map((g, i) => (
                <div
                  key={g.id}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border"
                  style={{
                    background: ["#6FA8FF", "#B98CFF", "#3CCB7A"][i % 3],
                    borderColor: isDark ? "rgba(25,30,45,0.9)" : "#fff",
                    color: "#fff",
                  }}
                  title={g.name}
                >
                  {g.name.charAt(0)}
                </div>
              ))}
              {event.guests.length > 3 && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.15)" : "#eee",
                    borderColor: isDark ? "rgba(25,30,45,0.9)" : "#fff",
                    color: isDark ? "#AEB6D0" : "#666",
                  }}
                >
                  +{event.guests.length - 3}
                </div>
              )}
            </div>
            <span
              className="text-xs"
              style={{ color: isDark ? "#7D86A6" : "#999" }}
            >
              {event.guests.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {secretMode && !event.isRevealed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSecret((s) => !s);
                }}
                className="p-1 rounded-full transition-all hover:opacity-70"
                title={showSecret ? "Hide details" : "Peek details"}
                data-ocid="event.toggle"
              >
                {showSecret ? (
                  <EyeOff
                    size={13}
                    style={{ color: isDark ? "#AEB6D0" : "#888" }}
                  />
                ) : (
                  <Eye
                    size={13}
                    style={{ color: isDark ? "#6FA8FF" : "#4a7fd4" }}
                  />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              className="text-xs px-2 py-1 rounded-lg transition-all hover:opacity-80"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.06)",
                color: isDark ? "#AEB6D0" : "#666",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,0,0,0.08)",
              }}
              data-ocid="event.edit_button"
            >
              Edit
            </button>

            {event.isCompleted ? (
              <div
                className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
                style={{
                  background: "rgba(60,203,122,0.15)",
                  color: "#3CCB7A",
                }}
              >
                <Trophy size={11} /> SURPRISED!
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReveal(event);
                }}
                className="gradient-btn text-xs font-semibold px-3 py-1.5 rounded-full text-white transition-all"
                data-ocid="event.primary_button"
              >
                Reveal 🎉
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
