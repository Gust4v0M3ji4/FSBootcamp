import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UserModal from "./UserModal";

const UsersTable = () => {
  const { users, currentUser, deleteUser, isAdmin, refreshUsers } = useAuth();
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create", // 'create' | 'edit'
    user: null,
  });
  const [loading, setLoading] = useState(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (users.length === 0) {
      loadUsers();
    }
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      await refreshUsers();
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setModalState({
      isOpen: true,
      mode: "create",
      user: null,
    });
  };

  const handleEditUser = (user) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      user,
    });
  };

  const handleDeleteUser = async (user) => {
    if (user._id === currentUser._id) {
      alert("No puedes eliminarte a ti mismo");
      return;
    }

    const confirmMessage = `¿Estás seguro de que quieres eliminar a ${user.firstName} ${user.lastName}?`;
    if (window.confirm(confirmMessage)) {
      setLoading(true);
      try {
        await deleteUser(user._id);
        await refreshUsers(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        alert("Error eliminando usuario");
      } finally {
        setLoading(false);
      }
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: "create",
      user: null,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container">
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#1f2937" }}>
              Usuarios Registrados
            </h2>
            <p className="user-count">
              Total: {users.length} usuario{users.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={loadUsers}
              className="btn btn-secondary"
              disabled={loading}
            >
              🔄 {loading ? "Cargando..." : "Actualizar"}
            </button>

            {isAdmin && (
              <button
                onClick={handleCreateUser}
                className="btn btn-primary"
                disabled={loading}
              >
                ➕ Agregar Usuario
              </button>
            )}
          </div>
        </div>

        {loading && users.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
          >
            <p>Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
          >
            <p>No hay usuarios registrados aún.</p>
            {isAdmin && <p>¡Crea el primer usuario!</p>}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Edad</th>
                  <th>Fecha de Registro</th>
                  <th>Última Actualización</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor:
                              user.role === "admin" ? "#dc2626" : "#667eea",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          {user.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600" }}>
                            {user.firstName} {user.lastName}
                          </div>
                          {user._id === currentUser._id && (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#667eea",
                                fontWeight: "500",
                              }}
                            >
                              (Tú)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#374151",
                        }}
                      >
                        {user.age || "N/A"} años
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.updatedAt)}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor:
                            user.role === "admin" ? "#fef2f2" : "#f3f4f6",
                          color: user.role === "admin" ? "#dc2626" : "#6b7280",
                        }}
                      >
                        {user.role === "admin" ? "Admin" : "Usuario"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {isAdmin && (
                          <button
                            onClick={() => handleEditUser(user)}
                            className="btn btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "14px" }}
                            title="Editar usuario"
                            disabled={loading}
                          >
                            ✏️
                          </button>
                        )}

                        {isAdmin && user._id !== currentUser._id && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="btn btn-danger"
                            style={{ padding: "6px 12px", fontSize: "14px" }}
                            title="Eliminar usuario"
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        )}

                        {!isAdmin && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              fontStyle: "italic",
                            }}
                          >
                            Solo lectura
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin && (
        <UserModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          user={modalState.user}
          mode={modalState.mode}
        />
      )}
    </div>
  );
};

export default UsersTable;
