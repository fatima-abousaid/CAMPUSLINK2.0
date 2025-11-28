import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("TOKEN"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get("/user");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosClient.post("/login", { email, password });

      localStorage.setItem("TOKEN", response.data.token);
      localStorage.setItem("USER", JSON.stringify(response.data.user));
      setToken(response.data.token);
      setUser(response.data.user);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Login failed"
      };
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("USER");
      setToken(null);
      setUser(null);
      delete axiosClient.defaults.headers.common["Authorization"];
    }
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};