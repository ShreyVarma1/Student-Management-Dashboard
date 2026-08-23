"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { studentService } from "../services/students_services";

import type {
  Student,
} from "../types/students";

export function useStudents() {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadStudents =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await studentService.getStudents();

        setStudents(data);
      } catch {
        setError(
          "Unable to load students."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return {
    students,
    loading,
    error,
    refreshStudents:
      loadStudents,
  };
}