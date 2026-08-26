"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  courseService,
} from "../services/courses_services";

import type {
  Course,
} from "../types/courses";

export function useCourses() {
  const [courses, setCourses] =
    useState<Course[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadCourses =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await courseService.getCourses();

        setCourses(data);
      } catch {
        setError(
          "Unable to load courses."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return {
    courses,
    loading,
    error,
    refreshCourses:
      loadCourses,
  };
}