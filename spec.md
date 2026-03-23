# Surprise Event Planner

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full Surprise Event Planner SPA (React + TypeScript + Tailwind)
- Dashboard with upcoming, completed, and today's events
- Create/Edit event form: title, secret message, date/time, location, guests, password lock
- Reveal Timer: countdown per event, lock details until timer ends
- Guest management: add/remove guests, RSVP status (Accepted/Pending/Declined)
- Secret Mode UI: blur/hide sensitive info, Reveal button per event
- Notification banners: simulated reminders (e.g. "3 days left!")
- Search by event name; filter by date or status
- Dark mode toggle
- Confetti animation on reveal
- Password lock for events (simple password prompt UI)
- Export event details as PDF (using window.print or canvas-based approach, no external libs)
- localStorage persistence for all data

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Set up React app with Tailwind, TypeScript
2. Define TypeScript types: Event, Guest, RSVPStatus
3. Implement localStorage hooks for persistence
4. Build Dashboard page with search/filter, tabs (upcoming/completed/today)
5. Build Event Card component with secret mode blur, countdown, reveal button, confetti
6. Build Create/Edit Event modal/page with all fields + guest list + password
7. Build Guest Management panel (add/remove/RSVP)
8. Add notification banner system
9. Dark mode toggle with CSS variables
10. Confetti animation (canvas-based, no libs)
11. PDF export via window.print styled print CSS
