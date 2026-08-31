import type {
  Event,
  EventInput,
} from "../types/events";

const STORAGE_KEY = "student-management-events";

const seedEvents: Event[] = [
  {
    id: 1,
    title: "Republic Day",
    description:
      "Republic Day holiday.",
    date: "2026-01-26",
    type: "Holiday",
  },
  {
    id: 2,
    title: "React Assessment",
    description:
      "React practical assessment for students.",
    date: "2026-09-05",
    type: "Exam",
  },
  {
    id: 3,
    title: "Web Development Workshop",
    description:
      "Workshop covering modern web development practices.",
    date: "2026-09-15",
    type: "Workshop",
  },
];

function readEvents(): Event[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored =
    localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(seedEvents)
    );

    return seedEvents;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Event[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(seedEvents)
    );

    return seedEvents;
  }
}

function saveEvents(
  events: Event[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(events)
  );
}

export const eventService = {
  async getEvents(): Promise<Event[]> {
    return readEvents();
  },

  async getEventById(
    id: number
  ): Promise<Event | undefined> {
    return readEvents().find(
      (event) => event.id === id
    );
  },

  async getEventsByDate(
    date: string
  ): Promise<Event[]> {
    return readEvents().filter(
      (event) => event.date === date
    );
  },

  async createEvent(
    data: EventInput
  ): Promise<Event> {
    const events = readEvents();

    const nextId =
      events.length === 0
        ? 1
        : Math.max(
            ...events.map(
              (event) => event.id
            )
          ) + 1;

    const newEvent: Event = {
      id: nextId,
      ...data,
    };

    saveEvents([
      ...events,
      newEvent,
    ]);

    return newEvent;
  },

  async updateEvent(
    id: number,
    data: EventInput
  ): Promise<Event> {
    const events = readEvents();

    const index =
      events.findIndex(
        (event) => event.id === id
      );

    if (index === -1) {
      throw new Error(
        "Event not found."
      );
    }

    const updatedEvent: Event = {
      id,
      ...data,
    };

    events[index] = updatedEvent;

    saveEvents(events);

    return updatedEvent;
  },

  async deleteEvent(
    id: number
  ): Promise<void> {
    const events = readEvents();

    const exists = events.some(
      (event) => event.id === id
    );

    if (!exists) {
      throw new Error(
        "Event not found."
      );
    }

    const updatedEvents =
      events.filter(
        (event) => event.id !== id
      );

    saveEvents(updatedEvents);
  },
};