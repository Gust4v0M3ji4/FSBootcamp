const express = require("express");

/** Db */
const mongoose = require("./db");

/** Middlewares */
const performance = require("./middlewares/performance");

/** Controllers */
const usersV1 = require("./controllers/v1/users");

//+++++++++++++++++++++++++++++++++++++++++++++//
const app = express();

app.use(express.json());

app.use(performance);

const PORT = 3030;
/** Controllers */
app.use("/api/users", usersV1);

// Endpoint de salud para verificar el estado de la API y la base de datos
app.get("/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: "Desconectado",
      1: "Conectado",
      2: "Conectando",
      3: "Desconectando",
    };

    const healthCheck = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: {
        status: dbStates[dbState] || "Desconocido",
        connected: dbState === 1,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      },
      server: {
        port: PORT,
        memory: process.memoryUsage(),
        version: process.version,
      },
    };

    // Si la base de datos no está conectada, cambiar el status general
    if (dbState !== 1) {
      healthCheck.status = "ERROR";
      healthCheck.database.error = "Base de datos no conectada";
    }

    const statusCode = healthCheck.status === "OK" ? 200 : 503;

    res.status(statusCode).json(healthCheck);
  } catch (error) {
    console.error("❌ Error en health check:", error);
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Bootcamp 2025 - API de Usuarios",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      users: "/api/users",
    },
    documentation:
      "Para ver todas las operaciones CRUD disponibles, revisa la documentación",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check disponible en http://localhost:${PORT}/health`);
  console.log(
    `👥 API de usuarios disponible en http://localhost:${PORT}/api/users`
  );
});
