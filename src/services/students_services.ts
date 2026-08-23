import type {
  Student,
  StudentInput,
} from "../types/students";

const STORAGE_KEY =
  "student-management-students";

const seedStudents: Student[] = [
  {
    id: 1,
    firstName: "Shrey",
    lastName: "Varma",
    email: "shrey@gmail.com",
    phone: "9876543210",
    dateOfBirth: "2002-05-10",
    course: "React",
    batch: "Batch 1",
    startDate: "2026-01-10",
    trainer: "Rahul Sharma",
    experience: 1,
    status: "Active",
    score: 85,
    pendingAssignments: 2,
  },
  {
    id: 2,
    firstName: "Aman",
    lastName: "Singh",
    email: "aman@gmail.com",
    phone: "9876543211",
    dateOfBirth: "2001-08-12",
    course: "Next.js",
    batch: "Batch 2",
    startDate: "2026-02-15",
    trainer: "Priya Singh",
    experience: 2,
    status: "Completed",
    score: 92,
    pendingAssignments: 0,
  },
  {
    id: 3,
    firstName: "Riya",
    lastName: "Sharma",
    email: "riya@gmail.com",
    phone: "9876543212",
    dateOfBirth: "2003-03-20",
    course: "TypeScript",
    batch: "Batch 3",
    startDate: "2026-03-01",
    trainer: "Ankit Kumar",
    experience: 1,
    status: "Active",
    score: 74,
    pendingAssignments: 4,
  },
];

function readStudents(): Student[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored =
    localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(seedStudents)
    );

    return seedStudents;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(seedStudents)
    );

    return seedStudents;
  }
}

function saveStudents(
  students: Student[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(students)
  );
}

export const studentService = {
  async getStudents(): Promise<Student[]> {
    return readStudents();
  },

  async getStudentById(
    id: number
  ): Promise<Student | undefined> {
    return readStudents().find(
      (student) => student.id === id
    );
  },

  async emailExists(
    email: string,
    excludeId?: number
  ): Promise<boolean> {
    return readStudents().some(
      (student) =>
        student.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        student.id !== excludeId
    );
  },

  async createStudent(
    data: StudentInput
  ): Promise<Student> {
    const students = readStudents();

    const exists =
      await this.emailExists(
        data.email
      );

    if (exists) {
      throw new Error(
        "A student with this email already exists."
      );
    }

    const nextId =
      students.length === 0
        ? 1
        : Math.max(
            ...students.map(
              (student) => student.id
            )
          ) + 1;

    const newStudent: Student = {
      id: nextId,
      ...data,
    };

    saveStudents([
      ...students,
      newStudent,
    ]);

    return newStudent;
  },

  async updateStudent(
    id: number,
    data: StudentInput
  ): Promise<Student> {
    const students = readStudents();

    const index =
      students.findIndex(
        (student) =>
          student.id === id
      );

    if (index === -1) {
      throw new Error(
        "Student not found."
      );
    }

    const exists =
      await this.emailExists(
        data.email,
        id
      );

    if (exists) {
      throw new Error(
        "A student with this email already exists."
      );
    }

    const updatedStudent: Student = {
      id,
      ...data,
    };

    students[index] =
      updatedStudent;

    saveStudents(students);

    return updatedStudent;
  },

  async deleteStudent(
    id: number
  ): Promise<void> {
    const students = readStudents();

    const exists =
      students.some(
        (student) =>
          student.id === id
      );

    if (!exists) {
      throw new Error(
        "Student not found."
      );
    }

    const updated =
      students.filter(
        (student) =>
          student.id !== id
      );

    saveStudents(updated);
  },
};