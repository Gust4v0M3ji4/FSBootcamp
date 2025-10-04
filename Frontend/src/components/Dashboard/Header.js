import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { currentUser, authMethod, logout, loading } = useAuth();

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      logout();
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">� Tarea 3 - Autenticación</div>

        <div className="user-info">
          <div className="auth-info">
            <span className="auth-method">
              {authMethod === "jwt" ? "🎫 JWT Token" : "🍪 Session Cookie"}
            </span>
            {currentUser?.role && (
              <span className={`role-badge ${currentUser.role}`}>
                {currentUser.role === "admin" ? "👨‍💼 Admin" : "👤 User"}
              </span>
            )}
          </div>
          <div className="user-details">
            <span className="welcome-text">
              Bienvenido,{" "}
              <strong>
                {currentUser?.name ||
                  `${currentUser?.firstName} ${currentUser?.lastName}`}
              </strong>
            </span>
            <span className="user-email">{currentUser?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? "Cerrando..." : "Cerrar Sesión"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
