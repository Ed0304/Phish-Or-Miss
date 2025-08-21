import React, { createContext, useState, useEffect, useContext } from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user data

  // Check localStorage on load
  useEffect(() => {
    const storedLogin = localStorage.getItem("loggedIn");
    const storedUser = localStorage.getItem("user");

    setIsLoggedIn(storedLogin === "true");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Call this on successful login
  const login = (userData) => {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Call this on logout
  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/get_user?id=${user._id}`);
      if (!res.ok) throw new Error("Failed to refresh user");
      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);
