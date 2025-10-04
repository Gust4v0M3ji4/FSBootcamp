import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [authMethod, setAuthMethod] = useState("session"); // 'jwt' or 'session'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, loginWithJWT, loginWithSession } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validaciones básicas
      if (!formData.email || !formData.password) {
        throw new Error("Todos los campos son obligatorios");
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Por favor ingresa un email válido");
      }

      // Login según el método seleccionado
      if (authMethod === "jwt") {
        await loginWithJWT(formData.email, formData.password);
      } else {
        await loginWithSession(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para probar con usuarios de prueba
  const quickLogin = async (email, password) => {
    setFormData({ email, password });
    setLoading(true);
    setError("");

    try {
      if (authMethod === "jwt") {
        await loginWithJWT(email, password);
      } else {
        await loginWithSession(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Iniciar Sesión</h1>
          <p>Bienvenido de vuelta</p>
        </div>

        {/* Selector de método de autenticación */}
        <div className="auth-method-selector">
          <div className="form-group">
            <label>Método de Autenticación:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="session"
                  checked={authMethod === "session"}
                  onChange={(e) => setAuthMethod(e.target.value)}
                  disabled={loading}
                />
                <span>Sesión (Cookies)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="jwt"
                  checked={authMethod === "jwt"}
                  onChange={(e) => setAuthMethod(e.target.value)}
                  disabled={loading}
                />
                <span>JWT (Token)</span>
              </label>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Tu contraseña"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading
              ? "Iniciando sesión..."
              : `Iniciar con ${authMethod === "jwt" ? "JWT" : "Sesión"}`}
          </button>
        </form>

        {/* Usuarios de prueba */}
        <div className="test-users">
          <h4>🧪 Usuarios de Prueba:</h4>
          <div className="test-user-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => quickLogin("admin@test.com", "admin123")}
              disabled={loading}
            >
              👨‍💼 Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => quickLogin("user@test.com", "user123")}
              disabled={loading}
            >
              👤 Usuario
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => quickLogin("john@test.com", "john123")}
              disabled={loading}
            >
              👤 John
            </button>
          </div>
          <p className="test-info">
            Método actual:{" "}
            <strong>
              {authMethod === "jwt" ? "JWT Token" : "Sesión con Cookies"}
            </strong>
          </p>
        </div>

        <div className="auth-switch">
          <span>¿No tienes cuenta? </span>
          <button onClick={onSwitchToRegister}>Regístrate aquí</button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
