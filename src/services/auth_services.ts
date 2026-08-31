import type {
  AuthUser,
  LoginInput,
  RegisterInput,
  User,
  UserRole,
} from "../types/auth";

const USERS_KEY = "registeredUsers";
const AUTH_KEY = "authenticatedUser";

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

    return parsedUsers.map((user: User) => ({
      ...user,
      role: user.role ?? "admin",
      active: user.active ?? true,
    }));
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

export const authService = {
  // =========================================
  // REGISTER
  // =========================================

  register(input: RegisterInput): {
    success: boolean;
    message: string;
    user?: AuthUser;
  } {
    const users = getUsers();

    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();

    if (!username) {
      return {
        success: false,
        message: "Username is required.",
      };
    }

    if (!email) {
      return {
        success: false,
        message: "Email is required.",
      };
    }

    if (!input.password) {
      return {
        success: false,
        message: "Password is required.",
      };
    }

    const usernameExists = users.some(
      (user) =>
        user.username.trim().toLowerCase() ===
        username.toLowerCase()
    );

    if (usernameExists) {
      return {
        success: false,
        message: "Username already exists.",
      };
    }

    const emailExists = users.some(
      (user) =>
        user.email.trim().toLowerCase() ===
        email
    );

    if (emailExists) {
      return {
        success: false,
        message:
          "An account with this email already exists.",
      };
    }

    const role: UserRole = input.role;

    if (
      role !== "admin" &&
      role !== "student"
    ) {
      return {
        success: false,
        message: "Invalid account role.",
      };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      password: input.password,
      role,
      active: true,
    };

    users.push(newUser);

    saveUsers(users);

    return {
      success: true,
      message: "Account created successfully.",
      user: toAuthUser(newUser),
    };
  },

  // =========================================
  // LOGIN
  // =========================================

  login(input: LoginInput): {
    success: boolean;
    message: string;
    user?: AuthUser;
  } {
    const users = getUsers();

    const email = input.email
      .trim()
      .toLowerCase();

    const user = users.find(
      (item) =>
        item.email.trim().toLowerCase() ===
          email &&
        item.password === input.password &&
        item.role === input.role
    );

    if (!user) {
      return {
        success: false,
        message:
          "Invalid email, password, or selected role.",
      };
    }

    if (user.active === false) {
      return {
        success: false,
        message:
          "Your account has been deactivated. Please contact the administrator.",
      };
    }

    const authUser = toAuthUser(user);

    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify(authUser)
    );

    return {
      success: true,
      message: "Login successful.",
      user: authUser,
    };
  },

  // =========================================
  // LOGOUT
  // =========================================

  logout(): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(AUTH_KEY);
  },

  // =========================================
  // GET CURRENT USER
  // =========================================

  getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser =
      localStorage.getItem(AUTH_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(
        storedUser
      );

      if (
        !parsedUser.id ||
        !parsedUser.username ||
        !parsedUser.email
      ) {
        return null;
      }

      const role: UserRole =
        parsedUser.role ?? "admin";

      return {
        id: parsedUser.id,
        username: parsedUser.username,
        email: parsedUser.email,
        role,
      };
    } catch {
      return null;
    }
  },

  // =========================================
  // IS AUTHENTICATED
  // =========================================

  isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    return Boolean(
      localStorage.getItem(AUTH_KEY)
    );
  },

  // =========================================
  // GET ALL USERS
  // =========================================

  getUsers(): User[] {
    return getUsers();
  },

  // =========================================
  // GET USER BY ID
  // =========================================

  getUserById(
    id: string
  ): User | undefined {
    return getUsers().find(
      (user) => user.id === id
    );
  },

  // =========================================
  // GET USER BY EMAIL
  // =========================================

  getUserByEmail(
    email: string
  ): User | undefined {
    const normalizedEmail =
      email.trim().toLowerCase();

    return getUsers().find(
      (user) =>
        user.email.trim().toLowerCase() ===
        normalizedEmail
    );
  },

  // =========================================
  // DEACTIVATE STUDENT ACCOUNT BY EMAIL
  // =========================================
  //
  // This is used when an Admin deletes a
  // Student record.
  //
  // Student:
  //     shrey@gmail.com
  //
  // Account:
  //     shrey@gmail.com
  //
  // Account becomes:
  //     active: false
  // =========================================

  deactivateStudentAccount(
    email: string
  ): {
    success: boolean;
    message: string;
  } {
    if (typeof window === "undefined") {
      return {
        success: false,
        message: "This operation is not available.",
      };
    }

    const users = getUsers();

    const normalizedEmail =
      email.trim().toLowerCase();

    const index = users.findIndex(
      (user) =>
        user.email.trim().toLowerCase() ===
          normalizedEmail &&
        user.role === "student"
    );

    if (index === -1) {
      return {
        success: false,
        message:
          "No student account found for this email.",
      };
    }

    users[index] = {
      ...users[index],
      active: false,
    };

    saveUsers(users);

    /*
     * If this account happens to be the
     * currently authenticated account,
     * remove the active session as well.
     */
    const currentUser =
      this.getCurrentUser();

    if (
      currentUser &&
      currentUser.email.trim().toLowerCase() ===
        normalizedEmail
    ) {
      localStorage.removeItem(AUTH_KEY);
    }

    return {
      success: true,
      message:
        "Student account deactivated successfully.",
    };
  },

  // =========================================
  // ACTIVATE STUDENT ACCOUNT
  // =========================================
  //
  // We may use this later if you want an
  // Admin to restore a student's access.
  // =========================================

  activateStudentAccount(
    email: string
  ): {
    success: boolean;
    message: string;
  } {
    if (typeof window === "undefined") {
      return {
        success: false,
        message: "This operation is not available.",
      };
    }

    const users = getUsers();

    const normalizedEmail =
      email.trim().toLowerCase();

    const index = users.findIndex(
      (user) =>
        user.email.trim().toLowerCase() ===
          normalizedEmail &&
        user.role === "student"
    );

    if (index === -1) {
      return {
        success: false,
        message:
          "No student account found for this email.",
      };
    }

    users[index] = {
      ...users[index],
      active: true,
    };

    saveUsers(users);

    return {
      success: true,
      message:
        "Student account activated successfully.",
    };
  },
};