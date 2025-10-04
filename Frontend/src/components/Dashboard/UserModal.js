import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const UserModal = ({ isOpen, onClose, user = null, mode = "create" }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, updateUser, refreshUsers } = useAuth();

  // Poblar el formulario cuando se edita un usuario
  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "", // No mostrar la contraseña actual
        age: user.age || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        age: "",
      });
    }
    setError("");
  }, [mode, user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validaciones
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.age
      ) {
        throw new Error("Nombre, apellido, email y edad son obligatorios");
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Por favor ingresa un email válido");
      }

      // Validar edad
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 1 || age > 120) {
        throw new Error("Por favor ingresa una edad válida (1-120 años)");
      }

      if (mode === "create") {
        // Para crear usuario, la contraseña es obligatoria
        if (!formData.password) {
          throw new Error("La contraseña es obligatoria");
        }
        if (formData.password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        await register({
          ...formData,
          age: parseInt(formData.age),
        });

        // Recargar la lista de usuarios después de crear
        await refreshUsers();
      } else {
        // Para editar usuario
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          age: parseInt(formData.age),
        };

        // Solo actualizar contraseña si se proporciona una nueva
        if (formData.password) {
          if (formData.password.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres");
          }
          updateData.password = formData.password;
        }

        await updateUser(user._id, updateData);

        // Recargar la lista de usuarios después de actualizar
        await refreshUsers();
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{mode === "create" ? "Crear Usuario" : "Editar Usuario"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "16px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input"
                placeholder="Nombre"
                disabled={loading}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input"
                placeholder="Apellido"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="email@ejemplo.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Edad</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input"
              placeholder="Edad"
              min="1"
              max="120"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {mode === "create" ? "Contraseña" : "Nueva Contraseña (opcional)"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder={
                mode === "create"
                  ? "Contraseña"
                  : "Dejar vacío para mantener actual"
              }
              disabled={loading}
            />
            {mode === "edit" && (
              <small style={{ color: "#6b7280", fontSize: "14px" }}>
                Deja vacío para mantener la contraseña actual
              </small>
            )}
          </div>

          <div className="actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? mode === "create"
                  ? "Creando..."
                  : "Actualizando..."
                : mode === "create"
                ? "Crear Usuario"
                : "Actualizar Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
