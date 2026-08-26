import type {
  Course,
  CourseInput,
} from "../types/courses";

const STORAGE_KEY = "student-management-courses";

const seedCourses: Course[] = [
  {
    id: 1,
    name: "React Development",
    description:
      "Frontend development using React and modern JavaScript.",
    duration: 12,
    trainer: "Rahul Sharma",
    startDate: "2026-09-01",
    status: "Active",
    capacity: 30,
    enrolledStudents: 18,
  },
  {
    id: 2,
    name: "Next.js Development",
    description:
      "Full-stack web development using Next.js and TypeScript.",
    duration: 10,
    trainer: "Priya Singh",
    startDate: "2026-08-15",
    status: "Active",
    capacity: 25,
    enrolledStudents: 20,
  },
  {
    id: 3,
    name: "TypeScript Fundamentals",
    description:
      "Learn TypeScript fundamentals, types, interfaces and advanced concepts.",
    duration: 6,
    trainer: "Ankit Kumar",
    startDate: "2026-07-01",
    status: "Completed",
    capacity: 20,
    enrolledStudents: 20,
  },
];

function readCourses(): Course[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(seedCourses)
    );

    return seedCourses;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(seedCourses)
    );

    return seedCourses;
  }
}

function saveCourses(
  courses: Course[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(courses)
  );
}

export const courseService = {
  async getCourses(): Promise<Course[]> {
    return readCourses();
  },

  async getCourseById(
    id: number
  ): Promise<Course | undefined> {
    return readCourses().find(
      (course) => course.id === id
    );
  },

  async nameExists(
    name: string,
    excludeId?: number
  ): Promise<boolean> {
    return readCourses().some(
      (course) =>
        course.name.trim().toLowerCase() ===
          name.trim().toLowerCase() &&
        course.id !== excludeId
    );
  },

  async createCourse(
    data: CourseInput
  ): Promise<Course> {
    const courses = readCourses();

    const exists =
      await this.nameExists(data.name);

    if (exists) {
      throw new Error(
        "A course with this name already exists."
      );
    }

    if (
      data.enrolledStudents >
      data.capacity
    ) {
      throw new Error(
        "Enrolled students cannot exceed course capacity."
      );
    }

    const nextId =
      courses.length === 0
        ? 1
        : Math.max(
            ...courses.map(
              (course) => course.id
            )
          ) + 1;

    const newCourse: Course = {
      id: nextId,
      ...data,
    };

    saveCourses([
      ...courses,
      newCourse,
    ]);

    return newCourse;
  },

  async updateCourse(
    id: number,
    data: CourseInput
  ): Promise<Course> {
    const courses = readCourses();

    const index =
      courses.findIndex(
        (course) =>
          course.id === id
      );

    if (index === -1) {
      throw new Error(
        "Course not found."
      );
    }

    const exists =
      await this.nameExists(
        data.name,
        id
      );

    if (exists) {
      throw new Error(
        "A course with this name already exists."
      );
    }

    if (
      data.enrolledStudents >
      data.capacity
    ) {
      throw new Error(
        "Enrolled students cannot exceed course capacity."
      );
    }

    const updatedCourse: Course = {
      id,
      ...data,
    };

    courses[index] =
      updatedCourse;

    saveCourses(courses);

    return updatedCourse;
  },

  async deleteCourse(
    id: number
  ): Promise<void> {
    const courses = readCourses();

    const exists =
      courses.some(
        (course) =>
          course.id === id
      );

    if (!exists) {
      throw new Error(
        "Course not found."
      );
    }

    const updated =
      courses.filter(
        (course) =>
          course.id !== id
      );

    saveCourses(updated);
  },
};