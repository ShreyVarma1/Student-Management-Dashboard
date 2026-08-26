export interface Course {
  id: number;
  name: string;
  description: string;
  duration: number;
  trainer: string;
  startDate: string;
  status: "Active" | "Completed" | "Inactive";
  capacity: number;
  enrolledStudents: number;
}

export type CourseInput = Omit<Course, "id">;