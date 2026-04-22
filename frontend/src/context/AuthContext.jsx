import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("tcc_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email, senha) => {
    const { data } = await api.post("/auth/login", { email, senha });
    localStorage.setItem("tcc_token", data.access_token);
    localStorage.setItem("tcc_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, senha, tipo) => {
    const { data } = await api.post("/auth/register", { name, email, senha, tipo });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("tcc_token");
    localStorage.removeItem("tcc_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
