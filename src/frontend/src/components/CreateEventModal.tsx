import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, User, X } from "lucide-react";
import { useState } from "react";
import type { EventType, Guest, RSVPStatus, SurpriseEvent } from "../types";
import { generateId, getEventIcon } from "../utils/eventUtils";

interface CreateEventModalProps {
  isDark: boolean;
  existingEvent?: SurpriseEvent;
  onSave: (event: SurpriseEvent) => void;
  onClose: () => void;
}

const EVENT_TYPES: EventType[] = [
  "birthday",
  "proposal",
  "party",
  "anniversary",
  "other",
];
const RSVP_OPTIONS: RSVPStatus[] = ["Accepted", "Pending", "Declined"];

export function CreateEventModal({
  isDark,
  existingEvent,
  onSave,
  onClose,
}: CreateEventModalProps) {
  const [title, setTitle] = useState(existingEvent?.title ?? "");
  const [secretMessage, setSecretMessage] = useState(
    existingEvent?.secretMessage ?? "",
  );
  const [eventDate, setEventDate] = useState(
    existingEvent?.eventDate
      ? new Date(existingEvent.eventDate).toISOString().slice(0, 16)
      : "",
  );
  const [location, setLocation] = useState(existingEvent?.location ?? "");
  const [password, setPassword] = useState(existingEvent?.password ?? "");
  const [eventType, setEventType] = useState<EventType>(
    existingEvent?.eventType ?? "party",
  );
  const [guests, setGuests] = useState<Guest[]>(existingEvent?.guests ?? []);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Event title is required";
    if (!eventDate) e.eventDate = "Date & time is required";
    if (!location.trim()) e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addGuest = () => {
    if (!guestName.trim()) return;
    setGuests((prev) => [
      ...prev,
      {
        id: generateId(),
        name: guestName.trim(),
        email: guestEmail.trim(),
        rsvp: "Pending",
      },
    ]);
    setGuestName("");
    setGuestEmail("");
  };

  const removeGuest = (id: string) =>
    setGuests((prev) => prev.filter((g) => g.id !== id));

  const updateGuestRsvp = (id: string, rsvp: RSVPStatus) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, rsvp } : g)));
  };

  const handleSave = () => {
    if (!validate()) return;
    const event: SurpriseEvent = {
      id: existingEvent?.id ?? generateId(),
      title: title.trim(),
      secretMessage: secretMessage.trim(),
      eventDate: new Date(eventDate).toISOString(),
      location: location.trim(),
      password: password.trim() || undefined,
      eventType,
      guests,
      isCompleted: existingEvent?.isCompleted ?? false,
      isRevealed: existingEvent?.isRevealed ?? false,
      createdAt: existingEvent?.createdAt ?? new Date().toISOString(),
    };
    onSave(event);
  };

  const overlayStyle = {
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(4px)",
  };
  const modalStyle = isDark
    ? {
        background: "rgba(20, 26, 42, 0.97)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }
    : {
        background: "rgba(255, 255, 255, 0.98)",
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
      };

  const inputStyle = {
    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    border: isDark
      ? "1px solid rgba(255,255,255,0.10)"
      : "1px solid rgba(0,0,0,0.1)",
    color: isDark ? "#F2F4FF" : "#1a1a2e",
  };

  const labelStyle = { color: isDark ? "#AEB6D0" : "#555" };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={overlayStyle}
      data-ocid="create_event.modal"
    >
      <div
        className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto slide-in"
        style={modalStyle}
        aria-label={existingEvent ? "Edit Surprise" : "New Surprise Event"}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-5 py-4 z-10"
          style={{
            background: isDark
              ? "rgba(20, 26, 42, 0.97)"
              : "rgba(255, 255, 255, 0.98)",
            borderBottom: isDark
              ? "1px solid rgba(255,255,255,0.07)"
              : "1px solid rgba(0,0,0,0.07)",
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
          >
            {existingEvent ? "✏️ Edit Surprise" : "✨ New Surprise Event"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:opacity-60 transition-opacity"
            data-ocid="create_event.close_button"
          >
            <X size={17} style={{ color: isDark ? "#AEB6D0" : "#888" }} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Event Type */}
          <div>
            <p className="text-xs font-medium mb-2" style={labelStyle}>
              Event Type
            </p>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setEventType(t)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background:
                      eventType === t
                        ? "linear-gradient(135deg, #6FA8FF, #B98CFF)"
                        : isDark
                          ? "rgba(255,255,255,0.07)"
                          : "rgba(0,0,0,0.06)",
                    color:
                      eventType === t ? "#fff" : isDark ? "#AEB6D0" : "#666",
                    border:
                      eventType === t
                        ? "none"
                        : isDark
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(0,0,0,0.08)",
                  }}
                  data-ocid="create_event.select"
                >
                  {getEventIcon(t)} {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="event-title"
              className="text-xs font-medium mb-1 block"
              style={labelStyle}
            >
              Event Title *
            </label>
            <Input
              id="event-title"
              placeholder="e.g. Emma's Birthday Bash"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              data-ocid="create_event.input"
            />
            {errors.title && (
              <p
                className="text-xs mt-1"
                style={{ color: "#ff6b6b" }}
                data-ocid="create_event.error_state"
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Secret Message */}
          <div>
            <label
              htmlFor="event-secret"
              className="text-xs font-medium mb-1 block"
              style={labelStyle}
            >
              Secret Message 🤫
            </label>
            <Textarea
              id="event-secret"
              placeholder="The secret details only organizers should know..."
              value={secretMessage}
              onChange={(e) => setSecretMessage(e.target.value)}
              rows={3}
              style={inputStyle}
              data-ocid="create_event.textarea"
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="event-date"
                className="text-xs font-medium mb-1 block"
                style={labelStyle}
              >
                Date & Time *
              </label>
              <Input
                id="event-date"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                style={inputStyle}
                data-ocid="create_event.input"
              />
              {errors.eventDate && (
                <p className="text-xs mt-1" style={{ color: "#ff6b6b" }}>
                  {errors.eventDate}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="event-location"
                className="text-xs font-medium mb-1 block"
                style={labelStyle}
              >
                Location *
              </label>
              <Input
                id="event-location"
                placeholder="Venue, address..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
                data-ocid="create_event.input"
              />
              {errors.location && (
                <p className="text-xs mt-1" style={{ color: "#ff6b6b" }}>
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="event-password"
              className="text-xs font-medium mb-1 block"
              style={labelStyle}
            >
              Password Lock (optional) 🔒
            </label>
            <Input
              id="event-password"
              type="password"
              placeholder="Leave blank for no password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              data-ocid="create_event.input"
            />
          </div>

          {/* Guests */}
          <div>
            <p className="text-xs font-medium mb-2" style={labelStyle}>
              Guest List
            </p>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGuest()}
                style={{ ...inputStyle, flex: 1 }}
                data-ocid="create_event.input"
              />
              <Input
                placeholder="Email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGuest()}
                style={{ ...inputStyle, flex: 1.5 }}
                data-ocid="create_event.input"
              />
              <button
                type="button"
                onClick={addGuest}
                className="px-3 py-2 rounded-xl text-white transition-all gradient-btn shrink-0"
                data-ocid="create_event.secondary_button"
              >
                <Plus size={15} />
              </button>
            </div>

            {guests.length > 0 && (
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {guests.map((g, i) => (
                  <div
                    key={g.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      background: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.07)"
                        : "1px solid rgba(0,0,0,0.07)",
                    }}
                    data-ocid={`create_event.item.${i + 1}`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{
                        background: ["#6FA8FF", "#B98CFF", "#3CCB7A"][i % 3],
                      }}
                    >
                      {g.name.charAt(0)}
                    </div>
                    <span
                      className="text-xs flex-1 truncate"
                      style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
                    >
                      {g.name}
                    </span>
                    <select
                      value={g.rsvp}
                      onChange={(e) =>
                        updateGuestRsvp(g.id, e.target.value as RSVPStatus)
                      }
                      className="text-xs rounded-lg px-2 py-1"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,0.07)"
                          : "rgba(0,0,0,0.05)",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(0,0,0,0.1)",
                        color:
                          g.rsvp === "Accepted"
                            ? "#3CCB7A"
                            : g.rsvp === "Declined"
                              ? "#ff6b6b"
                              : "#E0B34A",
                      }}
                      data-ocid="create_event.select"
                    >
                      {RSVP_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeGuest(g.id)}
                      className="p-1 rounded-full hover:opacity-60 transition-opacity shrink-0"
                      data-ocid="create_event.delete_button"
                    >
                      <Trash2
                        size={12}
                        style={{ color: isDark ? "#AEB6D0" : "#999" }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {guests.length === 0 && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                  border: isDark
                    ? "1px dashed rgba(255,255,255,0.1)"
                    : "1px dashed rgba(0,0,0,0.12)",
                }}
                data-ocid="create_event.empty_state"
              >
                <User
                  size={13}
                  style={{ color: isDark ? "#7D86A6" : "#bbb" }}
                />
                <span
                  className="text-xs"
                  style={{ color: isDark ? "#7D86A6" : "#bbb" }}
                >
                  No guests yet — add some above
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 flex gap-3 px-5 py-4"
          style={{
            background: isDark
              ? "rgba(20, 26, 42, 0.97)"
              : "rgba(255, 255, 255, 0.98)",
            borderTop: isDark
              ? "1px solid rgba(255,255,255,0.07)"
              : "1px solid rgba(0,0,0,0.07)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.07)"
                : "rgba(0,0,0,0.06)",
              color: isDark ? "#AEB6D0" : "#666",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.08)",
            }}
            data-ocid="create_event.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white gradient-btn"
            data-ocid="create_event.submit_button"
          >
            {existingEvent ? "Save Changes" : "Create Event ✨"}
          </button>
        </div>
      </div>
    </div>
  );
}
