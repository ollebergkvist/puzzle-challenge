// libs
import { createContext } from "preact";
import { route } from "preact-router";
import { useContext, useState } from "preact/hooks";

// types
import { AuthContextProps, AuthProviderProps } from "../types";

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const { token } = await response.json();

      localStorage.setItem("token", token);

      setIsAuthenticated(true);
      setUser(email);
      setToken(token);
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Failed to login");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setIsAuthenticated(false);
    setUser(null);

    route("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
