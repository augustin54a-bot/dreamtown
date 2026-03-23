export type RSVPStatus = "Accepted" | "Pending" | "Declined";

export type EventType =
  | "birthday"
  | "proposal"
  | "party"
  | "anniversary"
  | "other";

export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: RSVPStatus;
}

export interface SurpriseEvent {
  id: string;
  title: string;
  secretMessage: string;
  eventDate: string; // ISO string
  location: string;
  guests: Guest[];
  password?: string;
  isCompleted: boolean;
  isRevealed: boolean;
  createdAt: string;
  eventType: EventType;
}

export type ActiveTab = "dashboard" | "events" | "guests" | "new";
