require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
/** Db */
const mongoose = require("./db");

/** Middlewares */
const performance = require("./middlewares/performance");

/** Controllers */
const usersV1 = require("./controllers/v1/users");
const authsV1 = require("./controllers/v1/auths");

//+++++++++++++++++++++++++++++++++++++++++++++//
const app = express();

app.use(express.json());

app.use(performance);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      name: "sess:id",
      maxAge: 8 * 60 * 60 * 1000, // 8h
      secure: false,
    },
  })
);

const PORT = process.env.PORT || 3001;

/** Controllers */
app.use("/api/v1/users", usersV1);
app.use("/api/v1/auths", authsV1);

app.get("/", (req, res) => {
  req.session.counter = req.counter;
  res.json({
    message: "API Tarea 3 - Autenticación Backend",
    version: "1.0.0",
    endpoints: {
      authentication: {
        "POST /api/v1/auths/login": "Login con JSON → JWT",
        "GET /api/v1/auths/token": "Basic Auth → JWT",
        "POST /api/v1/auths/session/login": "Session Login",
        "POST /api/v1/auths/session/logout": "Session Logout",
        "GET /api/v1/auths/session/status": "Check Session Status",
      },
      users: {
        "GET /api/v1/users": "Obtener todos los usuarios (público)",
        "GET /api/v1/users/protected": "Obtener todos los usuarios (JWT)",
        "GET /api/v1/users/session-protected":
          "Obtener todos los usuarios (Sesión)",
        "POST /api/v1/users": "Crear usuario (público)",
        "POST /api/v1/users/protected": "Crear usuario (JWT)",
        "PUT /api/v1/users/:id": "Actualizar usuario (público)",
        "PUT /api/v1/users/protected/:id": "Actualizar usuario (JWT)",
        "DELETE /api/v1/users/:id": "Eliminar usuario (público)",
        "DELETE /api/v1/users/protected/:id": "Eliminar usuario (JWT)",
      },
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
});
