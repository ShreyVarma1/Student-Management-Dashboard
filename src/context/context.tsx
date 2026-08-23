"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

interface AppContextType {
  currentUser: string;

  setCurrentUser: (
    user: string
  ) => void;
}

const AppContext =
  createContext<
    AppContextType | undefined
  >(undefined);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    currentUser,
    setCurrentUser,
  ] = useState("Admin");

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside AppProvider"
    );
  }

  return context;
}