"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Trainer,
} from "../types/trainers";

import {
  trainerService,
} from "../services/trainers_services";

export function useTrainers() {
  const [
    trainers,
    setTrainers,
  ] = useState<Trainer[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const refreshTrainers =
    useCallback(() => {
      try {
        setLoading(true);
        setError(null);

        const data =
          trainerService.getAllTrainers();

        setTrainers(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load trainers."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    refreshTrainers();
  }, [refreshTrainers]);

  return {
    trainers,
    loading,
    error,
    refreshTrainers,
  };
}