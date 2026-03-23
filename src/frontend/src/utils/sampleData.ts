import type { SurpriseEvent } from "../types";

export function generateSampleData(): SurpriseEvent[] {
  const now = new Date();

  const addDays = (d: Date, days: number) => {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
  };

  const subtractDays = (d: Date, days: number) => {
    const r = new Date(d);
    r.setDate(r.getDate() - days);
    return r;
  };

  return [
    {
      id: "sample-1",
      title: "Emma's Birthday Bash",
      secretMessage:
        "We have reserved the rooftop garden at The Orchard restaurant! 🎂 Dress code is garden party chic. Emma has no idea!",
      eventDate: addDays(now, 5).toISOString(),
      location: "The Orchard Rooftop, 42 Blossom Lane, NYC",
      password: "emma123",
      isCompleted: false,
      isRevealed: false,
      createdAt: subtractDays(now, 10).toISOString(),
      eventType: "birthday",
      guests: [
        {
          id: "g1",
          name: "James Harper",
          email: "james@example.com",
          rsvp: "Accepted",
        },
        {
          id: "g2",
          name: "Lily Chen",
          email: "lily@example.com",
          rsvp: "Accepted",
        },
        {
          id: "g3",
          name: "Noah Williams",
          email: "noah@example.com",
          rsvp: "Pending",
        },
        {
          id: "g4",
          name: "Sofia Martinez",
          email: "sofia@example.com",
          rsvp: "Accepted",
        },
      ],
    },
    {
      id: "sample-2",
      title: "The Big Proposal 💍",
      secretMessage:
        "Booked a private table at Luminara Sky Dining — 80th floor, sunset view. The ring is hidden in the dessert. She said she loves chocolate lava cake!",
      eventDate: addDays(now, 34).toISOString(),
      location: "Luminara Sky Dining, 1 Cloud Tower, Chicago",
      isCompleted: false,
      isRevealed: false,
      createdAt: subtractDays(now, 2).toISOString(),
      eventType: "proposal",
      guests: [
        {
          id: "g5",
          name: "Marcus Reed",
          email: "marcus@example.com",
          rsvp: "Accepted",
        },
        {
          id: "g6",
          name: "Priya Nair",
          email: "priya@example.com",
          rsvp: "Pending",
        },
      ],
    },
    {
      id: "sample-3",
      title: "Graduation Celebration 🎓",
      secretMessage:
        "We surprised Alex with a rooftop party and a trip to Lisbon! Everyone was there. The look on their face was priceless.",
      eventDate: subtractDays(now, 15).toISOString(),
      location: "Skyline Terrace, 88 Graduate Ave, Boston",
      isCompleted: true,
      isRevealed: true,
      createdAt: subtractDays(now, 45).toISOString(),
      eventType: "party",
      guests: [
        {
          id: "g7",
          name: "Aiden Park",
          email: "aiden@example.com",
          rsvp: "Accepted",
        },
        {
          id: "g8",
          name: "Zoe Thompson",
          email: "zoe@example.com",
          rsvp: "Accepted",
        },
        {
          id: "g9",
          name: "Ethan Brooks",
          email: "ethan@example.com",
          rsvp: "Accepted",
        },
        {
          id: "g10",
          name: "Mia Davis",
          email: "mia@example.com",
          rsvp: "Declined",
        },
        {
          id: "g11",
          name: "Oliver Kim",
          email: "oliver@example.com",
          rsvp: "Accepted",
        },
      ],
    },
  ];
}
