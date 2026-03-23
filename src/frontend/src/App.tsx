import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  CalendarDays,
  Download,
  Eye,
  EyeOff,
  Filter,
  LayoutDashboard,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateEventModal } from "./components/CreateEventModal";
import { EventCard } from "./components/EventCard";
import { GuestTable } from "./components/GuestTable";
import { Notifications } from "./components/Notifications";
import { PasswordModal } from "./components/PasswordModal";
import { useConfetti } from "./hooks/useConfetti";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { ActiveTab, RSVPStatus, SurpriseEvent } from "./types";
import { getEventIcon } from "./utils/eventUtils";
import { generateSampleData } from "./utils/sampleData";

function initEvents(): SurpriseEvent[] {
  const stored = localStorage.getItem("surprise-events");
  if (stored) {
    try {
      return JSON.parse(stored) as SurpriseEvent[];
    } catch {
      // ignore
    }
  }
  return generateSampleData();
}

export default function App() {
  const [events, setEvents] = useLocalStorage<SurpriseEvent[]>(
    "surprise-events",
    initEvents(),
  );
  const [isDark, setIsDark] = useLocalStorage("surprise-dark", true);
  const [secretMode, setSecretMode] = useLocalStorage(
    "surprise-secret-mode",
    false,
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "completed" | "today"
  >("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SurpriseEvent | undefined>(
    undefined,
  );
  const [revealingEvent, setRevealingEvent] = useState<
    SurpriseEvent | undefined
  >(undefined);
  const [dismissedNotifs, setDismissedNotifs] = useLocalStorage<string[]>(
    "surprise-dismissed-notifs",
    [],
  );

  const { triggerConfetti } = useConfetti();

  const now = useMemo(() => new Date(), []);

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      );
    }
    if (statusFilter === "upcoming")
      result = result.filter(
        (e) => !e.isCompleted && new Date(e.eventDate) > now,
      );
    else if (statusFilter === "completed")
      result = result.filter((e) => e.isCompleted);
    else if (statusFilter === "today") {
      result = result.filter((e) => {
        const d = new Date(e.eventDate);
        return d.toDateString() === now.toDateString();
      });
    }
    return result;
  }, [events, search, statusFilter, now]);

  const upcomingEvents = useMemo(
    () => events.filter((e) => !e.isCompleted && new Date(e.eventDate) > now),
    [events, now],
  );

  const completedEvents = useMemo(
    () => events.filter((e) => e.isCompleted),
    [events],
  );

  const todayEvents = useMemo(
    () =>
      events.filter(
        (e) => new Date(e.eventDate).toDateString() === now.toDateString(),
      ),
    [events, now],
  );

  const handleReveal = (event: SurpriseEvent) => {
    const eventDate = new Date(event.eventDate);
    if (!event.isCompleted && eventDate > now) {
      toast.error("⏳ Not yet! The reveal timer hasn't ended.");
      return;
    }
    if (event.password && !event.isRevealed) {
      setRevealingEvent(event);
      return;
    }
    doReveal(event);
  };

  const doReveal = (event: SurpriseEvent) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, isRevealed: true, isCompleted: true } : e,
      ),
    );
    triggerConfetti();
    toast.success(`🎉 "${event.title}" is REVEALED!`);
  };

  const handlePasswordConfirm = (password: string) => {
    if (!revealingEvent) return;
    if (password === revealingEvent.password) {
      const eventToReveal = revealingEvent;
      setRevealingEvent(undefined);
      doReveal(eventToReveal);
    } else {
      toast.error("🔒 Wrong password!");
    }
  };

  const handleSaveEvent = (event: SurpriseEvent) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === event.id);
      if (exists) return prev.map((e) => (e.id === event.id ? event : e));
      return [...prev, event];
    });
    setShowCreateModal(false);
    setEditingEvent(undefined);
    toast.success(`✨ "${event.title}" saved!`);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Event deleted");
  };

  const handleUpdateRsvp = (
    eventId: string,
    guestId: string,
    rsvp: RSVPStatus,
  ) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              guests: e.guests.map((g) =>
                g.id === guestId ? { ...g, rsvp } : g,
              ),
            }
          : e,
      ),
    );
  };

  const handleExportPDF = (event: SurpriseEvent) => {
    const printContent = `
      <html><head><title>${event.title}</title><style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 700px; margin: 0 auto; }
        h1 { font-size: 28px; margin-bottom: 8px; }
        .meta { color: #666; font-size: 14px; margin-bottom: 24px; }
        .section { margin-bottom: 20px; }
        .section h2 { font-size: 16px; font-weight: bold; border-bottom: 2px solid #6FA8FF; padding-bottom: 4px; margin-bottom: 10px; }
        .pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: bold; }
        .accepted { background: #d1fae5; color: #065f46; }
        .pending { background: #fef3c7; color: #92400e; }
        .declined { background: #fee2e2; color: #991b1b; }
        table { width: 100%; border-collapse: collapse; }
        td, th { padding: 8px 12px; border: 1px solid #eee; text-align: left; font-size: 13px; }
        th { background: #f3f4f6; font-weight: 600; }
      </style></head><body>
        <h1>${getEventIcon(event.eventType)} ${event.title}</h1>
        <div class="meta">${new Date(event.eventDate).toLocaleString()} &nbsp;|&nbsp; ${event.location}</div>
        <div class="section">
          <h2>Secret Message</h2>
          <p>${event.secretMessage || "No message provided."}</p>
        </div>
        <div class="section">
          <h2>Guest List (${event.guests.length})</h2>
          <table><tr><th>Name</th><th>Email</th><th>RSVP</th></tr>
            ${event.guests.map((g) => `<tr><td>${g.name}</td><td>${g.email}</td><td><span class="pill ${g.rsvp.toLowerCase()}">${g.rsvp}</span></td></tr>`).join("")}
          </table>
        </div>
        <p style="color:#999;font-size:12px;margin-top:40px;">Generated by SurpriseIt · ${new Date().toLocaleDateString()}</p>
      </body></html>
    `;
    const w = window.open("", "_blank")!;
    w.document.write(printContent);
    w.document.close();
    w.print();
  };

  const bgStyle = isDark
    ? {
        background:
          "linear-gradient(135deg, #070A1A 0%, #0B1230 50%, #0A1D3A 100%)",
        position: "relative" as const,
        overflow: "hidden",
      }
    : {
        background:
          "linear-gradient(135deg, #EEF0FF 0%, #F5F0FF 50%, #EDF5FF 100%)",
        position: "relative" as const,
        overflow: "hidden",
      };

  const panelStyle = isDark
    ? {
        background: "rgba(25, 30, 45, 0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }
    : {
        background: "rgba(255, 255, 255, 0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
      };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={14} />,
    },
    { id: "events", label: "Events", icon: <CalendarDays size={14} /> },
    { id: "guests", label: "Guests", icon: <Users size={14} /> },
    { id: "new", label: "New Event", icon: <Plus size={14} /> },
  ];

  return (
    <div className="min-h-screen" style={bgStyle}>
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(42,107,134,0.35) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 450,
          height: 450,
          background:
            "radial-gradient(circle, rgba(139,77,125,0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 min-h-screen p-3 sm:p-6 lg:p-10">
        {/* Main Glass Panel */}
        <div
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden"
          style={panelStyle}
        >
          {/* NAV */}
          <nav
            className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3"
            style={{
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,0.07)"
                : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white gradient-btn">
                <Sparkles size={14} />
              </div>
              <span
                className="font-bold text-base hidden sm:block"
                style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
              >
                SurpriseIt
              </span>
            </div>

            {/* Tabs */}
            <div
              className="flex items-center gap-1 p-1 rounded-full"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.05)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,0,0,0.07)",
              }}
            >
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "new") {
                      setShowCreateModal(true);
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    background:
                      activeTab === tab.id && tab.id !== "new"
                        ? "linear-gradient(135deg, rgba(111,168,255,0.35), rgba(185,140,255,0.35))"
                        : "transparent",
                    color:
                      activeTab === tab.id && tab.id !== "new"
                        ? isDark
                          ? "#F2F4FF"
                          : "#1a1a2e"
                        : isDark
                          ? "#AEB6D0"
                          : "#666",
                    border:
                      activeTab === tab.id && tab.id !== "new"
                        ? isDark
                          ? "1px solid rgba(111,168,255,0.3)"
                          : "1px solid rgba(111,168,255,0.25)"
                        : "1px solid transparent",
                  }}
                  data-ocid={`nav.${tab.id}.link`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full transition-all hover:opacity-70"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.06)",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(0,0,0,0.07)",
                }}
                aria-label="Toggle dark mode"
                data-ocid="nav.toggle"
              >
                {isDark ? (
                  <Sun size={14} style={{ color: "#E0B34A" }} />
                ) : (
                  <Moon size={14} style={{ color: "#6FA8FF" }} />
                )}
              </button>
              <div
                className="flex items-center gap-2 px-2 py-1.5 rounded-full"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.06)",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(0,0,0,0.07)",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #6FA8FF, #B98CFF)",
                  }}
                >
                  <UserRound size={12} />
                </div>
                <Bell
                  size={13}
                  style={{ color: isDark ? "#AEB6D0" : "#888" }}
                />
              </div>
            </div>
          </nav>

          {/* HERO */}
          <div className="px-6 pt-8 pb-4 text-center">
            <h1
              className="text-3xl sm:text-4xl font-bold mb-2 leading-tight"
              style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
            >
              Plan the <span className="gradient-text">Perfect Surprise</span>{" "}
              🎊
            </h1>
            <p
              className="text-sm"
              style={{ color: isDark ? "#7D86A6" : "#888" }}
            >
              Secretly plan unforgettable moments for the people you love
            </p>
          </div>

          {/* MAIN CONTENT */}
          <main className="px-4 sm:px-6 pb-6">
            {/* Notifications */}
            <Notifications
              events={events}
              isDark={isDark}
              dismissed={dismissedNotifs}
              onDismiss={(id) => setDismissedNotifs((prev) => [...prev, id])}
            />

            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 fade-in">
                {/* Dashboard header */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
                  >
                    Event Dashboard
                  </h2>
                  <div className="flex items-center gap-3">
                    {/* Secret mode toggle */}
                    <div className="flex items-center gap-2">
                      {secretMode ? (
                        <EyeOff size={13} style={{ color: "#B98CFF" }} />
                      ) : (
                        <Eye
                          size={13}
                          style={{ color: isDark ? "#AEB6D0" : "#888" }}
                        />
                      )}
                      <span
                        className="text-xs"
                        style={{ color: isDark ? "#AEB6D0" : "#666" }}
                      >
                        Secret Mode
                      </span>
                      <button
                        type="button"
                        onClick={() => setSecretMode(!secretMode)}
                        style={{
                          background: secretMode
                            ? "linear-gradient(135deg, #6FA8FF, #B98CFF)"
                            : isDark
                              ? "rgba(255,255,255,0.15)"
                              : "rgba(0,0,0,0.15)",
                          width: "40px",
                          height: "22px",
                          borderRadius: "11px",
                          position: "relative",
                          display: "inline-block",
                          transition: "background 300ms",
                          border: "none",
                          cursor: "pointer",
                        }}
                        aria-label="Toggle secret mode"
                        aria-pressed={secretMode}
                        data-ocid="dashboard.toggle"
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "3px",
                            left: secretMode ? "20px" : "3px",
                            width: "16px",
                            height: "16px",
                            background: "#fff",
                            borderRadius: "50%",
                            transition: "left 200ms",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                            display: "block",
                          }}
                        />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(true)}
                      className="gradient-btn flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-medium"
                      data-ocid="dashboard.primary_button"
                    >
                      <Plus size={15} /> Add Event
                    </button>
                  </div>
                </div>

                {/* Today's Surprises */}
                {todayEvents.length > 0 && (
                  <section>
                    <div
                      className="rounded-2xl p-4 mb-2"
                      style={{
                        background: isDark
                          ? "rgba(111,168,255,0.12)"
                          : "rgba(111,168,255,0.08)",
                        border: isDark
                          ? "1px solid rgba(111,168,255,0.25)"
                          : "1px solid rgba(111,168,255,0.2)",
                      }}
                    >
                      <h3
                        className="text-base font-semibold mb-3"
                        style={{ color: isDark ? "#6FA8FF" : "#4a7fd4" }}
                      >
                        🎉 Today's Surprises!
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {todayEvents.map((e) => (
                          <EventCard
                            key={e.id}
                            event={e}
                            secretMode={secretMode}
                            isDark={isDark}
                            onReveal={handleReveal}
                            onEdit={(ev) => {
                              setEditingEvent(ev);
                              setShowCreateModal(true);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Upcoming Events */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-base font-semibold"
                      style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
                    >
                      Upcoming Surprises
                      <span
                        className="ml-2 text-xs font-normal"
                        style={{ color: isDark ? "#7D86A6" : "#999" }}
                      >
                        ({upcomingEvents.length})
                      </span>
                    </h3>
                  </div>
                  {upcomingEvents.length === 0 ? (
                    <div
                      className="rounded-2xl p-8 text-center"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.02)",
                        border: isDark
                          ? "1px dashed rgba(255,255,255,0.1)"
                          : "1px dashed rgba(0,0,0,0.1)",
                      }}
                      data-ocid="upcoming.empty_state"
                    >
                      <p className="text-3xl mb-2">🎊</p>
                      <p
                        className="text-sm"
                        style={{ color: isDark ? "#7D86A6" : "#bbb" }}
                      >
                        No upcoming surprises yet!
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="mt-3 gradient-btn px-4 py-2 rounded-full text-white text-sm font-medium"
                        data-ocid="upcoming.primary_button"
                      >
                        Plan one now
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {upcomingEvents.map((e, i) => (
                        <div key={e.id} data-ocid={`upcoming.item.${i + 1}`}>
                          <EventCard
                            event={e}
                            secretMode={secretMode}
                            isDark={isDark}
                            onReveal={handleReveal}
                            onEdit={(ev) => {
                              setEditingEvent(ev);
                              setShowCreateModal(true);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Completed Events */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-base font-semibold"
                      style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
                    >
                      Completed Surprises
                      <span
                        className="ml-2 text-xs font-normal"
                        style={{ color: isDark ? "#7D86A6" : "#999" }}
                      >
                        ({completedEvents.length})
                      </span>
                    </h3>
                  </div>
                  {completedEvents.length === 0 ? (
                    <div
                      className="rounded-2xl p-6 text-center"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.02)",
                        border: isDark
                          ? "1px dashed rgba(255,255,255,0.1)"
                          : "1px dashed rgba(0,0,0,0.1)",
                      }}
                      data-ocid="completed.empty_state"
                    >
                      <p
                        className="text-sm"
                        style={{ color: isDark ? "#7D86A6" : "#bbb" }}
                      >
                        No completed events yet
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {completedEvents.map((e, i) => (
                        <div key={e.id} data-ocid={`completed.item.${i + 1}`}>
                          <EventCard
                            event={e}
                            secretMode={secretMode}
                            isDark={isDark}
                            onReveal={handleReveal}
                            onEdit={(ev) => {
                              setEditingEvent(ev);
                              setShowCreateModal(true);
                            }}
                            compact
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === "events" && (
              <div className="space-y-5 fade-in">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
                  >
                    All Events
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="gradient-btn flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-medium"
                    data-ocid="events.primary_button"
                  >
                    <Plus size={15} /> New Event
                  </button>
                </div>

                {/* Search + Filter */}
                <div className="flex gap-2 flex-wrap">
                  <div
                    className="flex-1 min-w-[180px] flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{
                      background: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.05)",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.09)"
                        : "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <Search
                      size={13}
                      style={{ color: isDark ? "#7D86A6" : "#bbb" }}
                    />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
                      data-ocid="events.search_input"
                    />
                  </div>
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{
                      background: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.05)",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.09)"
                        : "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <Filter
                      size={13}
                      style={{ color: isDark ? "#7D86A6" : "#bbb" }}
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value as typeof statusFilter)
                      }
                      className="bg-transparent text-sm outline-none"
                      style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
                      data-ocid="events.select"
                    >
                      <option value="all">All</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="today">Today</option>
                    </select>
                  </div>
                </div>

                {filteredEvents.length === 0 ? (
                  <div
                    className="rounded-2xl p-10 text-center"
                    style={{
                      background: isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)",
                      border: isDark
                        ? "1px dashed rgba(255,255,255,0.1)"
                        : "1px dashed rgba(0,0,0,0.1)",
                    }}
                    data-ocid="events.empty_state"
                  >
                    <p className="text-2xl mb-2">🔍</p>
                    <p
                      className="text-sm"
                      style={{ color: isDark ? "#7D86A6" : "#bbb" }}
                    >
                      No events match your search
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredEvents.map((e, i) => (
                      <div
                        key={e.id}
                        className="group relative"
                        data-ocid={`events.item.${i + 1}`}
                      >
                        <EventCard
                          event={e}
                          secretMode={secretMode}
                          isDark={isDark}
                          onReveal={handleReveal}
                          onEdit={(ev) => {
                            setEditingEvent(ev);
                            setShowCreateModal(true);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleExportPDF(e)}
                          className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          style={{
                            background: isDark
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.08)",
                          }}
                          title="Export PDF"
                          data-ocid="events.secondary_button"
                        >
                          <Download
                            size={12}
                            style={{ color: isDark ? "#AEB6D0" : "#888" }}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(e.id)}
                          className="absolute top-10 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          style={{
                            background: isDark
                              ? "rgba(255,100,100,0.15)"
                              : "rgba(255,100,100,0.1)",
                          }}
                          title="Delete event"
                          data-ocid="events.delete_button"
                        >
                          <span
                            className="text-xs"
                            style={{ color: "#ff6b6b" }}
                          >
                            ✕
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* GUESTS TAB */}
            {activeTab === "guests" && (
              <div className="space-y-5 fade-in">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: isDark ? "#F2F4FF" : "#1a1a2e" }}
                >
                  Guest Management
                </h2>
                <GuestTable
                  events={events}
                  isDark={isDark}
                  onUpdateRsvp={handleUpdateRsvp}
                />
              </div>
            )}
          </main>

          {/* FOOTER */}
          <footer
            className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
            style={{
              borderTop: isDark
                ? "1px solid rgba(255,255,255,0.07)"
                : "1px solid rgba(0,0,0,0.06)",
              color: isDark ? "#7D86A6" : "#aaa",
            }}
          >
            <div className="flex items-center gap-3">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Help</span>
            </div>
            <p>
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition-opacity"
                style={{ color: isDark ? "#6FA8FF" : "#4a7fd4" }}
              >
                caffeine.ai
              </a>
            </p>
          </footer>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          isDark={isDark}
          existingEvent={editingEvent}
          onSave={handleSaveEvent}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEvent(undefined);
          }}
        />
      )}

      {revealingEvent && (
        <PasswordModal
          eventTitle={revealingEvent.title}
          isDark={isDark}
          onConfirm={handlePasswordConfirm}
          onCancel={() => setRevealingEvent(undefined)}
        />
      )}

      <Toaster />
    </div>
  );
}
