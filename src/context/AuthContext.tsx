import { createContext, useEffect, useState } from "react";

type ContextType = {
  token: string | null;
  name: string | null;
  login: (token: string, name: string) => void;
  logout: () => void;
};
const initialContext = {
  name: null,
  token: null,
  login: () => {},
  logout: () => {},
} as ContextType;

export const AuthContext = createContext<typeof initialContext>(initialContext);

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("chat-app-token") ?? null,
  );
  const [name, setName] = useState<string | null>(
    localStorage.getItem("chat-app-user") ?? null,
  );

  useEffect(() => {
    const token = localStorage.getItem("chat-app-token");
    const name = localStorage.getItem("chat-app-user");
    if (token && name) {
      setToken(token);
      setName(name);
    }
  }, []);

  const login = (token: string, name: string) => {
    setToken(token);
    setName(name);
    localStorage.setItem("chat-app-token", token);
    localStorage.setItem("chat-app-user", name);
  };
  const logout = () => {
    localStorage.removeItem("chat-app-token");
    localStorage.removeItem("chat-app-user");
    setToken(null);
    setName(null);
  };
  return (
    <AuthContext.Provider value={{ token, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
