export type StudentStatus = "Active" | "Completed" | "Inactive";

export interface Student {
  id: number;

  firstName: string;
  lastName: string;

  email: string;
  phone: string;
  dateOfBirth: string;

  course: string;
  batch: string;
  startDate: string;
  trainer: string;
  experience: number;

  status: StudentStatus;

  score: number;
  pendingAssignments: number;
}

export type StudentInput = Omit<Student, "id">;