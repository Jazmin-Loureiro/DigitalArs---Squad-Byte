import { useState } from "react";
import { AuthContext } from "./AuthContext";
import authService from "../services/authService";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email, password) => {
    const data = await authService.login(email, password);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // Permite actualizar nombre, apellido y datos sincronizados sin necesidad de re-loguear
  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      const mergedUser = { ...prevUser, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(mergedUser));
      return mergedUser;
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
