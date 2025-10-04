import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useLocalStorage("users", []);
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);
  const [authMethod, setAuthMethod] = useLocalStorage("authMethod", "session"); // 'jwt' or 'session'
  const [loading, setLoading] = useState(false);

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (authMethod === "session") {
          const sessionData = await api.checkSessionStatus();
          if (sessionData && sessionData.data) {
            setCurrentUser(sessionData.data.user);
          }
        } else if (authMethod === "jwt" && api.token) {
          // JWT está guardado en localStorage, el usuario sigue autenticado
          // Podrías hacer una llamada para verificar que el token sigue válido
        }
      } catch (error) {
        console.log("No hay sesión activa");
        setCurrentUser(null);
      }
    };

    checkAuthStatus();
  }, [authMethod, setCurrentUser]);

  // Función para registrar un nuevo usuario en el backend
  const register = async (userData) => {
    setLoading(true);
    try {
      const { email, password, firstName, lastName, age } = userData;

      // Crear usuario en el backend
      const response = await api.createUser({
        name: `${firstName} ${lastName}`,
        email,
        password,
        age: parseInt(age),
        apiKey: `key-${Date.now()}`,
      });

      if (response.code === "OK") {
        console.log("Usuario registrado exitosamente:", response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.message || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      throw new Error(error.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión con JWT
  const loginWithJWT = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      if (response.code === "OK" && response.data) {
        setCurrentUser(response.data.user);
        setAuthMethod("jwt");
        console.log("Login JWT exitoso:", response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login JWT:", error);
      throw new Error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión con Sesión
  const loginWithSession = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.sessionLogin(email, password);
      if (response.code === "OK" && response.data) {
        setCurrentUser(response.data.user);
        setAuthMethod("session");
        console.log("Login Session exitoso:", response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login Session:", error);
      throw new Error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Función genérica de login (por defecto usa sesión)
  const login = async (email, password, method = "session") => {
    if (method === "jwt") {
      return await loginWithJWT(email, password);
    } else {
      return await loginWithSession(email, password);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
      setCurrentUser(null);
      setAuthMethod("session");
      console.log("Logout exitoso");
    } catch (error) {
      console.error("Error en logout:", error);
      // Incluso si hay error, limpiamos la sesión local
      setCurrentUser(null);
      setAuthMethod("session");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener usuarios (para el dashboard)
  const fetchUsers = async (isProtected = false) => {
    try {
      let response;
      if (isProtected && authMethod === "jwt") {
        response = await api.getProtectedUsers();
      } else if (isProtected && authMethod === "session") {
        response = await api.getSessionProtectedUsers();
      } else {
        response = await api.getUsers();
      }

      if (response.code === "OK" && response.data) {
        setUsers(response.data.users || []);
        return response.data.users || [];
      } else {
        throw new Error(response.message || "Error al obtener usuarios");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  };

  // Función para actualizar un usuario (simulada - no está implementada en el backend)
  const updateUser = (userId, updatedData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, ...updatedData, updatedAt: new Date().toISOString() }
          : user
      )
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  // Función para eliminar un usuario (simulada - no está implementada en el backend)
  const deleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

    if (currentUser && currentUser.id === userId) {
      logout();
    }
  };

  // Función para verificar si el usuario actual es admin
  const isAdmin = () => {
    return currentUser && currentUser.role === "admin";
  };

  const value = {
    users,
    currentUser,
    authMethod,
    loading,
    register,
    login,
    loginWithJWT,
    loginWithSession,
    logout,
    updateUser,
    deleteUser,
    fetchUsers,
    isAdmin,
    isAuthenticated: !!currentUser,
    setCurrentUser,
    setAuthMethod,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
