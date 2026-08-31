import type { AuthUser, User } from "../types/auth";
import type { Student } from "../types/students";
import { studentService } from "./students_services";

const USERS_KEY = "registeredUsers";

interface LinkedStudentResult {
  student: Student | undefined;
  user: User | undefined;
}

function getUsers(): User[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedUsers = localStorage.getItem(USERS_KEY);

  if (!storedUsers) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(storedUsers);

    if (!Array.isArray(parsedUsers)) {
      return [];
    }

    return parsedUsers as User[];
  } catch {
    return [];
  }
}

export const studentAccountService = {
  // =========================================
  // GET LINKED STUDENT
  // =========================================
  //
  // A student account is linked to a Student
  // record using the email address.
  //
  // Example:
  //
  // Account:
  // shrey@gmail.com
  //
  // Student:
  // shrey@gmail.com
  //
  // These two records are considered linked.
  // =========================================

  async getLinkedStudent(
    user: AuthUser
  ): Promise<LinkedStudentResult> {
    if (!user) {
      return {
        student: undefined,
        user: undefined,
      };
    }

    const users = getUsers();

    const account = users.find(
      (item) =>
        item.id === user.id ||
        item.email.trim().toLowerCase() ===
          user.email.trim().toLowerCase()
    );

    if (!account) {
      return {
        student: undefined,
        user: undefined,
      };
    }

    const student =
      await studentService.getStudentByEmail(
        account.email
      );

    return {
      student,
      user: account,
    };
  },

  // =========================================
  // CHECK WHETHER STUDENT ACCOUNT EXISTS
  // =========================================

  async studentAccountExists(
    email: string
  ): Promise<boolean> {
    const users = getUsers();

    const normalizedEmail =
      email.trim().toLowerCase();

    return users.some(
      (user) =>
        user.email.trim().toLowerCase() ===
          normalizedEmail &&
        user.role === "student"
    );
  },

  // =========================================
  // GET STUDENT ACCOUNT BY EMAIL
  // =========================================

  async getStudentAccountByEmail(
    email: string
  ): Promise<User | undefined> {
    const users = getUsers();

    const normalizedEmail =
      email.trim().toLowerCase();

    return users.find(
      (user) =>
        user.email.trim().toLowerCase() ===
          normalizedEmail &&
        user.role === "student"
    );
  },

  // =========================================
  // GET STUDENT ACCOUNT BY ID
  // =========================================

  async getStudentAccountById(
    id: string
  ): Promise<User | undefined> {
    const users = getUsers();

    return users.find(
      (user) =>
        user.id === id &&
        user.role === "student"
    );
  },
};