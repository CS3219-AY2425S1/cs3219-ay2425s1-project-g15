// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string;
  login: (response: { access_token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>("");

  const login = (response: { access_token: string }) => {
    const access_token = response.access_token;

    // store user data for 1 hour
    Cookies.set("access_token", access_token, { expires: 1 / 24 });
    setToken(access_token);
  };

  const logout = () => {
    setToken("");
    Cookies.remove("access_token");
  };

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      setToken(access_token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
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
