"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  eventService,
} from "../services/events_services";

import type {
  Event,
} from "../types/events";

export function useEvents() {
  const [events, setEvents] =
    useState<Event[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadEvents =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await eventService.getEvents();

        setEvents(data);
      } catch {
        setError(
          "Unable to load events."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    refreshEvents: loadEvents,
  };
}