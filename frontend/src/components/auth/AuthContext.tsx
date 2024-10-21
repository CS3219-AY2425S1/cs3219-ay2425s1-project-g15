// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getBaseUserData, login, logout } from "@/api/user";

export enum AuthStatus {
  UNAUTHENTICATED = "UNAUTHENTICATED",
  AUTHENTICATED = "AUTHENTICATED",
  ADMIN = "ADMIN",
}

interface AuthContextType {
  authStatus: AuthStatus;
  username: string;
  id: string;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(AuthStatus.UNAUTHENTICATED);
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const { username, id, isAdmin } = getBaseUserData();
    if (username) setUsername(username);
    if (id) setId(id);
    if (!username) setAuthStatus(AuthStatus.UNAUTHENTICATED);
    else if (isAdmin) setAuthStatus(AuthStatus.ADMIN);
    else setAuthStatus(AuthStatus.AUTHENTICATED);
  }, []);

  return (
    <AuthContext.Provider value={{ username, id, authStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
