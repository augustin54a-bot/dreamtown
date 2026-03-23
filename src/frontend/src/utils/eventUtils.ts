import type { EventType } from "../types";

export function getEventIcon(type: EventType): string {
  const icons: Record<EventType, string> = {
    birthday: "🎂",
    proposal: "💍",
    party: "🎉",
    anniversary: "💝",
    other: "✨",
  };
  return icons[type];
}

export function getEventGradient(type: EventType): string {
  const gradients: Record<EventType, string> = {
    birthday: "linear-gradient(90deg, #FF6B9D, #FFB347)",
    proposal: "linear-gradient(90deg, #B98CFF, #6FA8FF)",
    party: "linear-gradient(90deg, #6FA8FF, #3CCB7A)",
    anniversary: "linear-gradient(90deg, #FFE66D, #FF6B9D)",
    other: "linear-gradient(90deg, #4ECDC4, #B98CFF)",
  };
  return gradients[type];
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}
