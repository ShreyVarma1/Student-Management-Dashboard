"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  authService,
} from "../services/auth_services";

import type {
  AuthUser,
  LoginInput,
  RegisterInput,
} from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;

  login: (
    input: LoginInput
  ) => {
    success: boolean;
    message: string;
    user?: AuthUser;
  };

  register: (
    input: RegisterInput
  ) => {
    success: boolean;
    message: string;
    user?: AuthUser;
  };

  logout: () => void;

  isAuthenticated: boolean;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const currentUser =
      authService.getCurrentUser();

    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (input: LoginInput) => {
    const result =
      authService.login(input);

    if (result.success && result.user) {
      setUser(result.user);
    }

    return result;
  };

  const register = (
    input: RegisterInput
  ) => {
    const result =
      authService.register(input);

    return result;
  };

  const logout = () => {
    authService.logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}