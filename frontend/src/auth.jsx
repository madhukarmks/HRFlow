import React, { createContext, useContext, useMemo, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hrflow_user") || "null"); } catch { return null; }
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("hrflow_token", data.accessToken);
    localStorage.setItem("hrflow_user", JSON.stringify(data));
    setUser(data);
    return data;
  };
  const logout = () => {
    localStorage.removeItem("hrflow_token");
    localStorage.removeItem("hrflow_user");
    setUser(null);
    location.href = "/login";
  };
  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
