export type EventType =
  | "Event"
  | "Holiday"
  | "Exam"
  | "Workshop"
  | "Meeting"
  | "Other";

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  type: EventType;
}

export type EventInput = Omit<Event, "id">;