const router = require("express").Router();
const { body, param, query, validationResult } = require("express-validator");

/* Models */
const Users = require("../../models/users");

// ========== VALIDACIONES ==========

// Validaciones para crear usuario
const validateCreateUser = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .trim(),

  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("age")
    .isInt({ min: 0, max: 150 })
    .withMessage("La edad debe ser un número entre 0 y 150"),
];

// Validaciones para actualizar usuario
const validateUpdateUser = [
  param("id").isMongoId().withMessage("ID de usuario inválido"),

  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("age")
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage("La edad debe ser un número entre 0 y 150"),
];

// Validación para parámetro ID
const validateId = [
  param("id").isMongoId().withMessage("ID de usuario inválido"),
];

// ========== ENDPOINTS CRUD ==========

// GET /api/users - Listar usuarios con paginación y filtros
router.get("/", async (req, res) => {
  try {
    console.log("📋 GET /api/v1/users - Query params:", req.query);

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sort: req.query.sort || "createdAt",
      order: req.query.order || "desc",
      name: req.query.name,
      email: req.query.email,
      minAge: req.query.minAge,
      maxAge: req.query.maxAge,
      isActive: req.query.isActive !== "false", // Por defecto true, solo false si se especifica
    };

    const result = await Users.getAllUsers(options);

    if (!result.success) {
      return res.status(500).json({
        code: "ER",
        message: "Error obteniendo usuarios",
        error: result.error,
      });
    }

    res.status(200).json({
      code: "OK",
      message: "Usuarios obtenidos exitosamente",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error en GET /users:", error);
    res.status(500).json({
      code: "ER",
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

// POST /api/users - Crear nuevo usuario
router.post("/", validateCreateUser, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: "PF",
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    console.log("➕ POST /api/v1/users - Body:", req.body);

    const { name, email, age } = req.body;
    const userData = { name, email, age };

    const result = await Users.saveUser(userData);

    if (!result.success) {
      return res.status(400).json({
        code: "ER",
        message: "Error creando usuario",
        error: result.error,
      });
    }

    res.status(201).json({
      code: "OK",
      message: "Usuario creado exitosamente",
      data: { user: result.data },
    });
  } catch (error) {
    console.error("❌ Error en POST /users:", error);
    res.status(500).json({
      code: "ER",
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get("/:id", validateId, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: "PF",
        message: "ID de usuario inválido",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    console.log(`🔍 GET /api/v1/users/${id}`);

    const result = await Users.getUserById(id);

    if (!result.success) {
      const statusCode = result.error === "Usuario no encontrado" ? 404 : 400;
      return res.status(statusCode).json({
        code: "NF",
        message: result.error,
      });
    }

    res.status(200).json({
      code: "OK",
      message: "Usuario encontrado",
      data: { user: result.data },
    });
  } catch (error) {
    console.error("❌ Error en GET /users/:id:", error);
    res.status(500).json({
      code: "ER",
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

// PUT /api/users/:id - Actualizar usuario
router.put("/:id", validateUpdateUser, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: "PF",
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    console.log(`✏️ PUT /api/v1/users/${id} - Body:`, req.body);

    // Filtrar solo los campos que se enviaron
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.age !== undefined) updateData.age = req.body.age;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        code: "PF",
        message: "No se proporcionaron datos para actualizar",
      });
    }

    const result = await Users.updateUser(id, updateData);

    if (!result.success) {
      const statusCode = result.error === "Usuario no encontrado" ? 404 : 400;
      return res.status(statusCode).json({
        code: result.error === "Usuario no encontrado" ? "NF" : "ER",
        message: result.error,
      });
    }

    res.status(200).json({
      code: "OK",
      message: "Usuario actualizado exitosamente",
      data: { user: result.data },
    });
  } catch (error) {
    console.error("❌ Error en PUT /users/:id:", error);
    res.status(500).json({
      code: "ER",
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

// DELETE /api/users/:id - Eliminar usuario (eliminación lógica)
router.delete("/:id", validateId, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: "PF",
        message: "ID de usuario inválido",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    console.log(`🗑️ DELETE /api/v1/users/${id}`);

    const result = await Users.deleteUser(id);

    if (!result.success) {
      const statusCode = result.error === "Usuario no encontrado" ? 404 : 400;
      return res.status(statusCode).json({
        code: "NF",
        message: result.error,
      });
    }

    res.status(200).json({
      code: "OK",
      message: "Usuario eliminado exitosamente (eliminación lógica)",
      data: { user: result.data },
    });
  } catch (error) {
    console.error("❌ Error en DELETE /users/:id:", error);
    res.status(500).json({
      code: "ER",
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

module.exports = router;
