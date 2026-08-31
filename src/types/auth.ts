export type UserRole = "admin" | "student";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
  role: UserRole;
}