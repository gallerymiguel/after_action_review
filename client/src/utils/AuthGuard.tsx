// AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import Auth from "../utils/auth";

const AuthContext = createContext({ isLoading: true, isLoggedIn: false });

import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("id_token");
    // Assume a synchronous check if token exists, or decode it as needed:
    if (token && Auth.loggedIn()) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
