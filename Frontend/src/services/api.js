const API_URL = "http://localhost:3001/api/v1";

class Api {
  constructor() {
    this.API_URL = "http://localhost:3001/api/v1";
    this.token = localStorage.getItem("authToken");
  }

  // Configurar token para requests autenticados
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }

  // Headers para requests autenticados
  getAuthHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Login con JSON → JWT
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auths/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      if (data.data && data.data.token) {
        this.setToken(data.data.token);
      }
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Login con sesión
  async sessionLogin(email, password) {
    try {
      const response = await fetch(`${API_URL}/auths/session/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Session login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Session login error:", error);
      throw error;
    }
  }

  // Logout con sesión
  async logout() {
    try {
      const response = await fetch(`${API_URL}/auths/session/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      this.setToken(null); // Limpiar token local
      return await response.json();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  // Verificar estado de sesión
  async checkSessionStatus() {
    try {
      const response = await fetch(`${API_URL}/auths/session/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Session status error:", error);
      return null;
    }
  }

  // Crear usuario
  async createUser(userData) {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "User creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  }

  // Obtener usuarios (público)
  async getUsers() {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }

      return await response.json();
    } catch (error) {
      console.error("Get users error:", error);
      throw error;
    }
  }

  // Obtener usuarios protegido (JWT)
  async getProtectedUsers() {
    try {
      const response = await fetch(`${API_URL}/users/protected`, {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch protected users");
      }

      return await response.json();
    } catch (error) {
      console.error("Get protected users error:", error);
      throw error;
    }
  }

  // Obtener usuarios protegido (Sesión)
  async getSessionProtectedUsers() {
    try {
      const response = await fetch(`${API_URL}/users/session-protected`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch session protected users"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Get session protected users error:", error);
      throw error;
    }
  }
}

export const api = new Api();
export default api;
