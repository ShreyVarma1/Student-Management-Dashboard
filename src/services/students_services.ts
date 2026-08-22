import type { Student, StudentInput } from "../types/students";

const STORAGE_KEY = "student-management-students";

const seedStudents: Student[] = [
  {
    id: 1,
    firstName: "Shrey",
    lastName: "Varma",
    email: "shrey@gmail.com",
    phone: "9876543210",
    dateOfBirth: "2002-05-15",
    course: "React",
    batch: "Batch 1",
    startDate: "2026-01-10",
    trainer: "Rahul Sharma",
    experience: 2,
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
    dateOfBirth: "2001-08-20",
    course: "Next.js",
    batch: "Batch 2",
    startDate: "2026-01-15",
    trainer: "Priya Mehta",
    experience: 1,
    status: "Active",
    score: 72,
    pendingAssignments: 3,
  },
  {
    id: 3,
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@gmail.com",
    phone: "9876543212",
    dateOfBirth: "2000-11-12",
    course: "TypeScript",
    batch: "Batch 1",
    startDate: "2025-10-05",
    trainer: "Rahul Sharma",
    experience: 3,
    status: "Completed",
    score: 91,
    pendingAssignments: 0,
  },
  {
    id: 4,
    firstName: "Rahul",
    lastName: "Verma",
    email: "rahul@gmail.com",
    phone: "9876543213",
    dateOfBirth: "2002-03-22",
    course: "JavaScript",
    batch: "Batch 3",
    startDate: "2026-02-01",
    trainer: "Amit Kumar",
    experience: 1,
    status: "Inactive",
    score: 48,
    pendingAssignments: 5,
  },
  {
    id: 5,
    firstName: "Ananya",
    lastName: "Gupta",
    email: "ananya@gmail.com",
    phone: "9876543214",
    dateOfBirth: "2001-07-18",
    course: "React",
    batch: "Batch 2",
    startDate: "2025-12-15",
    trainer: "Priya Mehta",
    experience: 2,
    status: "Active",
    score: 76,
    pendingAssignments: 1,
  },
];

function initializeStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  const existingStudents = localStorage.getItem(STORAGE_KEY);

  if (!existingStudents) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(seedStudents)
    );
  }
}

function readStudentsFromStorage(): Student[] {
  if (typeof window === "undefined") {
    return [];
  }

  initializeStorage();

  const storedStudents = localStorage.getItem(STORAGE_KEY);

  if (!storedStudents) {
    return [];
  }

  try {
    return JSON.parse(storedStudents) as Student[];
  } catch {
    return [];
  }
}

function writeStudentsToStorage(students: Student[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(students)
  );
}

export const studentService = {
  async getStudents(): Promise<Student[]> {
    return readStudentsFromStorage();
  },

  async getStudentById(
    id: number
  ): Promise<Student | undefined> {
    const students = readStudentsFromStorage();

    return students.find(
      (student) => student.id === id
    );
  },

  async createStudent(
    data: StudentInput
  ): Promise<Student> {
    const students = readStudentsFromStorage();

    const newStudent: Student = {
      ...data,
      id: Date.now(),
    };

    const updatedStudents = [
      ...students,
      newStudent,
    ];

    writeStudentsToStorage(updatedStudents);

    return newStudent;
  },

  async updateStudent(
    id: number,
    data: StudentInput
  ): Promise<Student> {
    const students = readStudentsFromStorage();

    const index = students.findIndex(
      (student) => student.id === id
    );

    if (index === -1) {
      throw new Error("Student not found");
    }

    const updatedStudent: Student = {
      ...data,
      id,
    };

    const updatedStudents = [...students];

    updatedStudents[index] = updatedStudent;

    writeStudentsToStorage(updatedStudents);

    return updatedStudent;
  },

  async deleteStudent(id: number): Promise<void> {
    const students = readStudentsFromStorage();

    const updatedStudents = students.filter(
      (student) => student.id !== id
    );

    writeStudentsToStorage(updatedStudents);
  },
};