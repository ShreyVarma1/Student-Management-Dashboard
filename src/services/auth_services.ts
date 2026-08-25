import type {
  AuthUser,
  LoginInput,
  RegisterInput,
  User,
} from "../types/auth";

const USERS_KEY = "registeredUsers";
const AUTH_KEY = "authenticatedUser";

const getUsers = (): User[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedUsers =
    localStorage.getItem(USERS_KEY);

  if (!storedUsers) {
    return [];
  }

  try {
    return JSON.parse(storedUsers);
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
};

export const authService = {
  register(input: RegisterInput): {
    success: boolean;
    message: string;
    user?: AuthUser;
  } {
    const users = getUsers();

    const usernameExists = users.some(
      (user) =>
        user.username.toLowerCase() ===
        input.username.toLowerCase()
    );

    if (usernameExists) {
      return {
        success: false,
        message: "Username already exists.",
      };
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() ===
        input.email.toLowerCase()
    );

    if (emailExists) {
      return {
        success: false,
        message:
          "An account with this email already exists.",
      };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username: input.username.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
    };

    users.push(newUser);

    saveUsers(users);

    const authUser: AuthUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    return {
      success: true,
      message:
        "Account created successfully.",
      user: authUser,
    };
  },

  login(input: LoginInput): {
    success: boolean;
    message: string;
    user?: AuthUser;
  } {
    const users = getUsers();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() ===
          input.email.toLowerCase() &&
        item.password === input.password
    );

    if (!user) {
      return {
        success: false,
        message:
          "Invalid email or password.",
      };
    }

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

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

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

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
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    return Boolean(
      localStorage.getItem(AUTH_KEY)
    );
  },
};