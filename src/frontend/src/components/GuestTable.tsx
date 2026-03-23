import { useState } from "react";
import type { RSVPStatus, SurpriseEvent } from "../types";

interface GuestTableProps {
  events: SurpriseEvent[];
  isDark: boolean;
  onUpdateRsvp: (eventId: string, guestId: string, rsvp: RSVPStatus) => void;
}

const RSVP_OPTIONS: RSVPStatus[] = ["Accepted", "Pending", "Declined"];

export function GuestTable({ events, isDark, onUpdateRsvp }: GuestTableProps) {
  const [filterRsvp, setFilterRsvp] = useState<RSVPStatus | "All">("All");

  const allGuests = events.flatMap((e) =>
    e.guests.map((g) => ({ ...g, eventTitle: e.title, eventId: e.id })),
  );

  const filtered =
    filterRsvp === "All"
      ? allGuests
      : allGuests.filter((g) => g.rsvp === filterRsvp);

  const rsvpColor = (rsvp: RSVPStatus) =>
    rsvp === "Accepted"
      ? "#3CCB7A"
      : rsvp === "Declined"
        ? "#ff6b6b"
        : "#E0B34A";

  const rsvpBg = (rsvp: RSVPStatus, dark: boolean) =>
    rsvp === "Accepted"
      ? dark
        ? "rgba(60,203,122,0.15)"
        : "rgba(60,203,122,0.1)"
      : rsvp === "Declined"
        ? dark
          ? "rgba(255,107,107,0.15)"
          : "rgba(255,107,107,0.1)"
        : dark
          ? "rgba(224,179,74,0.15)"
          : "rgba(224,179,74,0.1)";

  const tableStyle = isDark
    ? {
        background: "rgba(25, 30, 45, 0.55)",
        border: "1px solid rgba(255,255,255,0.08)",
      }
    : {
        background: "rgba(255, 255, 255, 0.85)",
        border: "1px solid rgba(0,0,0,0.08)",
      };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4" data-ocid="guests.tab">
        {(["All", "Accepted", "Pending", "Declined"] as const).map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilterRsvp(f)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              background:
                filterRsvp === f
                  ? "linear-gradient(135deg, #6FA8FF, #B98CFF)"
                  : isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.06)",
              color: filterRsvp === f ? "#fff" : isDark ? "#AEB6D0" : "#666",
              border:
                filterRsvp === f
                  ? "none"
                  : isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(0,0,0,0.08)",
            }}
            data-ocid="guests.toggle"
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={tableStyle}
        data-ocid="guests.table"
      >
        <div
          className="grid gap-0"
          style={{ gridTemplateColumns: "2fr 2fr 2fr 1.5fr 1.5fr" }}
        >
          {["Guest", "Email", "Event", "RSVP", "Action"].map((h) => (
            <div
              key={h}
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              style={{
                color: isDark ? "#7D86A6" : "#999",
                borderBottom: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {h}
            </div>
          ))}

          {filtered.length === 0 && (
            <div
              className="col-span-5 px-4 py-8 text-center text-sm"
              style={{ color: isDark ? "#7D86A6" : "#bbb" }}
              data-ocid="guests.empty_state"
            >
              No guests found
            </div>
          )}
          {filtered.map((g, i) => (
            <>
              <div
                key={`name-${g.id}`}
                className="px-4 py-3 flex items-center gap-2"
                style={{
                  borderBottom: isDark
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "1px solid rgba(0,0,0,0.04)",
                }}
                data-ocid={`guests.item.${i + 1}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{
                    background: ["#6FA8FF", "#B98CFF", "#3CCB7A"][i % 3],
                  }}
                >
                  {g.name.charAt(0)}
                </div>
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
                >
                  {g.name}
                </span>
              </div>
              <div
                key={`email-${g.id}`}
                className="px-4 py-3 text-xs truncate flex items-center"
                style={{
                  color: isDark ? "#AEB6D0" : "#666",
                  borderBottom: isDark
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "1px solid rgba(0,0,0,0.04)",
                }}
              >
                {g.email || "—"}
              </div>
              <div
                key={`event-${g.id}`}
                className="px-4 py-3 text-xs truncate flex items-center"
                style={{
                  color: isDark ? "#AEB6D0" : "#555",
                  borderBottom: isDark
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "1px solid rgba(0,0,0,0.04)",
                }}
              >
                {g.eventTitle}
              </div>
              <div
                key={`rsvp-${g.id}`}
                className="px-4 py-3 flex items-center"
                style={{
                  borderBottom: isDark
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: rsvpBg(g.rsvp, isDark),
                    color: rsvpColor(g.rsvp),
                    border: `1px solid ${rsvpColor(g.rsvp)}33`,
                  }}
                >
                  {g.rsvp}
                </span>
              </div>
              <div
                key={`action-${g.id}`}
                className="px-4 py-3 flex items-center"
                style={{
                  borderBottom: isDark
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <select
                  value={g.rsvp}
                  onChange={(e) =>
                    onUpdateRsvp(g.eventId, g.id, e.target.value as RSVPStatus)
                  }
                  className="text-xs rounded-lg px-2 py-1"
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(0,0,0,0.05)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(0,0,0,0.1)",
                    color: rsvpColor(g.rsvp),
                  }}
                  data-ocid="guests.select"
                >
                  {RSVP_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
