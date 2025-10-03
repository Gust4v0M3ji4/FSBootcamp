const router = require("express").Router();
const { query, validationResult } = require("express-validator");
/* Models */
const Users = require("../../models/users");

/** Middlewares */
const apiKeyMiddleware = require("../../middlewares/apiKey");
const jwtAuthMiddleware = require("../../middlewares/jwtAuth");
const sessionMiddleware = require("../../middlewares/session");

let users = [
  {
    id: 1,
    name: "Carlos",
    email: "carlos@gmail.com",
    age: 20,
  },
];

/** Middleware  Api Key*/
//router.use(apiKeyMiddleware)
/** Middleware  Basic Auth*/
//router.use(basicAuthMiddleware)
/** Middleware  JWT*/

// Proteger todas las rutas con JWT por defecto
router.use("/protected", jwtAuthMiddleware);

// Rutas públicas (sin protección)
// Entity: users
/** */
router.get("/", (req, res) => {
  return Users.getAllUsers((err, users) => {
    if (err) {
      return res
        .status(500)
        .json({ code: "ER", message: "Error getting users!" });
    }
    res.json({ code: "OK", message: "Users are available!", data: { users } });
  });
});

// Rutas protegidas con JWT
router.get("/protected", (req, res) => {
  return Users.getAllUsers((err, users) => {
    if (err) {
      return res
        .status(500)
        .json({ code: "ER", message: "Error getting users!" });
    }
    res.json({
      code: "OK",
      message: "Protected users data retrieved successfully!",
      data: { users },
      requestedBy: req.session.user,
    });
  });
});

router.get("/query", query("id").notEmpty(), (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ code: "PF", message: "User ID is required!" });
  }

  const id = req.query.id;

  return Users.getUserById(id, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ code: "ER", message: "Error getting user!" });
    }
    if (!user) {
      return res.status(404).json({ code: "NF", message: "User not found!" });
    }
    res.json({ code: "OK", message: "User is available!", data: { user } });
  });
});

// Rutas protegidas con JWT
router.get(
  "/protected/query",
  jwtAuthMiddleware,
  query("id").notEmpty(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ code: "PF", message: "User ID is required!" });
    }

    const id = req.query.id;

    return Users.getUserById(id, (err, user) => {
      if (err) {
        return res
          .status(500)
          .json({ code: "ER", message: "Error getting user!" });
      }
      if (!user) {
        return res.status(404).json({ code: "NF", message: "User not found!" });
      }
      res.json({
        code: "OK",
        message: "Protected user data retrieved successfully!",
        data: { user },
        requestedBy: req.session.user,
      });
    });
  }
);

router.post("/", (req, res) => {
  console.log("POST /users:", req.body);
  const {
    name,
    email = new Date().getTime() + "@gmail.com",
    age,
    password,
    apiKey,
  } = req.body;

  const newUser = {
    id: new Date().getTime(),
    name,
    email,
    age,
    password,
    apiKey,
  };

  return Users.saveUser(newUser, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ code: "ER", message: "Error creating user!" });
    }
    res.json({
      code: "OK",
      message: "User created successfully!",
      data: { user },
    });
  });
});

// Versión protegida con JWT para crear usuarios
router.post("/protected", jwtAuthMiddleware, (req, res) => {
  console.log("POST /users/protected:", req.body);
  const {
    name,
    email = new Date().getTime() + "@gmail.com",
    age,
    password,
    apiKey,
  } = req.body;

  const newUser = {
    id: new Date().getTime(),
    name,
    email,
    age,
    password,
    apiKey,
  };

  return Users.saveUser(newUser, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ code: "ER", message: "Error creating user!" });
    }
    res.json({
      code: "OK",
      message: "User created successfully via protected route!",
      data: { user },
      createdBy: req.session.user,
    });
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id == id);

  if (user) {
    /** Update user */
    const { name, email, age, password, apiKey } = req.body;
    user.name = name;
    user.email = email;
    user.age = age;
    user.password = password;
    user.apiKey = apiKey;

    res.json({
      code: "OK",
      message: "User updated successfully!",
      data: { user },
    });
    return;
  }
  /** User not found  */
  res.status(404).json({ code: "NF", message: "User not found!" });
});

// Versión protegida con JWT para actualizar usuarios
router.put("/protected/:id", jwtAuthMiddleware, (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id == id);

  if (user) {
    /** Update user */
    const { name, email, age, password, apiKey } = req.body;
    user.name = name;
    user.email = email;
    user.age = age;
    user.password = password;
    user.apiKey = apiKey;

    res.json({
      code: "OK",
      message: "User updated successfully via protected route!",
      data: { user },
      updatedBy: req.session.user,
    });
    return;
  }
  /** User not found  */
  res.status(404).json({ code: "NF", message: "User not found!" });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  console.log("DELETE /users/:id:", id);
  const user = users.find((user) => user.id == id);
  if (user) {
    users = users.filter((user) => user.id != id);
    return res.json({ code: "OK", message: "User deleted!", data: { user } });
  }
  res.status(404).json({ code: "PF", message: "User not found!" });
});

// Versión protegida con JWT para eliminar usuarios
router.delete("/protected/:id", jwtAuthMiddleware, (req, res) => {
  const id = req.params.id;
  console.log("DELETE /users/protected/:id:", id);
  const user = users.find((user) => user.id == id);
  if (user) {
    users = users.filter((user) => user.id != id);
    return res.json({
      code: "OK",
      message: "User deleted via protected route!",
      data: { user },
      deletedBy: req.session.user,
    });
  }
  res.status(404).json({ code: "PF", message: "User not found!" });
});

// Ruta adicional protegida con sesiones para demostrar el funcionamiento
router.get("/session-protected", sessionMiddleware, (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ code: "UA", message: "Session required!" });
  }

  return Users.getAllUsers((err, users) => {
    if (err) {
      return res
        .status(500)
        .json({ code: "ER", message: "Error getting users!" });
    }
    res.json({
      code: "OK",
      message: "Session-protected users data retrieved!",
      data: { users },
      sessionUser: req.session.user,
    });
  });
});

module.exports = router;
