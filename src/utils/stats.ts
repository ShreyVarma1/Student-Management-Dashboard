import type { Student,} from "../types/students";
export function getStudentStats(
  students: Student[]
) {
  const totalStudents =
    students.length;

  const activeStudents =
    students.filter(
      (student) =>
        student.status === "Active"
    ).length;

  const completedStudents =
    students.filter(
      (student) =>
        student.status ===
        "Completed"
    ).length;

  const averageScore =
    totalStudents === 0
      ? 0
      : students.reduce(
          (
            total,
            student
          ) =>
            total +
            student.score,
          0
        ) / totalStudents;

  const pendingAssignments =
    students.reduce(
      (
        total,
        student
      ) =>
        total +
        student.pendingAssignments,
      0
    );

  return {
    totalStudents,
    activeStudents,
    completedStudents,
    averageScore,
    pendingAssignments,
  };
}