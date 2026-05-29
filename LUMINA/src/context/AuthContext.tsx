import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("lumina_token");
    if (storedToken) {
      // Validate token
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setToken(storedToken);
            setUser(data.user);
          } else {
            localStorage.removeItem("lumina_token");
          }
        })
        .catch(() => localStorage.removeItem("lumina_token"))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("lumina_token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("lumina_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
