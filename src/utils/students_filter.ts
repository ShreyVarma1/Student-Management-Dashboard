import type {
  Student,
  StudentFilters,
} from "../types/students";

export function filterStudents(
  students: Student[],
  filters: StudentFilters
): Student[] {
  const searchTerm =
    filters.search.trim().toLowerCase();

  return students.filter((student) => {
    const fullName =
      `${student.firstName} ${student.lastName}`
        .toLowerCase();

    const email =
      student.email.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      fullName.includes(searchTerm) ||
      email.includes(searchTerm);

    const matchesCourse =
      filters.course === "" ||
      student.course === filters.course;

    const matchesStatus =
      filters.status === "" ||
      student.status === filters.status;

    let matchesScore = true;

    if (filters.scoreRange === "0-50") {
      matchesScore =
        student.score >= 0 &&
        student.score <= 50;
    }

    if (filters.scoreRange === "51-75") {
      matchesScore =
        student.score >= 51 &&
        student.score <= 75;
    }

    if (filters.scoreRange === "76-100") {
      matchesScore =
        student.score >= 76 &&
        student.score <= 100;
    }

    return (
      matchesSearch &&
      matchesCourse &&
      matchesStatus &&
      matchesScore
    );
  });
}