"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  Student,
  StudentInput,
} from "../types/students";

import { studentService } from "../services/students_services";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await studentService.getStudents();

      setStudents(data);
    } catch {
      setError("Unable to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const createStudent = async (
    data: StudentInput
  ) => {
    const newStudent =
      await studentService.createStudent(data);

    setStudents((currentStudents) => [
      ...currentStudents,
      newStudent,
    ]);

    return newStudent;
  };

  const updateStudent = async (
    id: number,
    data: StudentInput
  ) => {
    const updatedStudent =
      await studentService.updateStudent(id, data);

    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === id
          ? updatedStudent
          : student
      )
    );

    return updatedStudent;
  };

  const deleteStudent = async (id: number) => {
    await studentService.deleteStudent(id);

    setStudents((currentStudents) =>
      currentStudents.filter(
        (student) => student.id !== id
      )
    );
  };

  return {
    students,
    loading,
    error,
    loadStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}