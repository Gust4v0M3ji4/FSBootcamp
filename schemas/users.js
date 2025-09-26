const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingrese un email válido",
      ],
    },
    age: {
      type: Number,
      required: [true, "La edad es requerida"],
      min: [0, "La edad no puede ser negativa"],
      max: [150, "La edad no puede ser mayor a 150 años"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Índices para mejorar performance en consultas
userSchema.index({ email: 1 });
userSchema.index({ name: 1 });
userSchema.index({ age: 1 });
userSchema.index({ isActive: 1 });

const User = mongoose.model("User", userSchema);

// ========== OPERACIONES CRUD ==========

// CREATE - Crear un nuevo usuario
const saveUser = async (userData) => {
  try {
    const user = new User(userData);
    const savedUser = await user.save();
    console.log("✅ Nuevo usuario creado:", savedUser._id);
    return { success: true, data: savedUser };
  } catch (error) {
    console.error("❌ Error creando usuario:", error.message);
    return { success: false, error: error.message };
  }
};

// READ - Obtener todos los usuarios con paginación y filtros
const findAllUsers = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      name,
      email,
      minAge,
      maxAge,
      isActive = true,
    } = options;

    // Construir filtros
    const filters = { isActive };

    if (name) {
      filters.name = { $regex: name, $options: "i" }; // Búsqueda insensible a mayúsculas
    }

    if (email) {
      filters.email = { $regex: email, $options: "i" };
    }

    if (minAge || maxAge) {
      filters.age = {};
      if (minAge) filters.age.$gte = parseInt(minAge);
      if (maxAge) filters.age.$lte = parseInt(maxAge);
    }

    // Construir ordenamiento
    const sortObj = {};
    sortObj[sort] = order === "desc" ? -1 : 1;

    // Calcular skip
    const skip = (page - 1) * limit;

    // Ejecutar consulta
    const users = await User.find(filters)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    // Contar total de documentos
    const total = await User.countDocuments(filters);

    console.log(`📋 Encontrados ${users.length} usuarios de ${total} total`);

    return {
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error.message);
    return { success: false, error: error.message };
  }
};

// READ - Obtener usuario por ID
const findUserById = async (id) => {
  try {
    // Validar si es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "ID de usuario inválido" };
    }

    const user = await User.findById(id).select("-__v");

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    if (!user.isActive) {
      return { success: false, error: "Usuario no activo" };
    }

    console.log("🔍 Usuario encontrado:", user._id);
    return { success: true, data: user };
  } catch (error) {
    console.error("❌ Error obteniendo usuario:", error.message);
    return { success: false, error: error.message };
  }
};

// UPDATE - Actualizar usuario por ID
const updateUser = async (id, updateData) => {
  try {
    // Validar si es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "ID de usuario inválido" };
    }

    // Remover campos que no se deben actualizar
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-__v");

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    console.log("✏️ Usuario actualizado:", user._id);
    return { success: true, data: user };
  } catch (error) {
    console.error("❌ Error actualizando usuario:", error.message);
    return { success: false, error: error.message };
  }
};

// DELETE - Eliminación lógica (marcar como inactivo)
const deleteUser = async (id) => {
  try {
    // Validar si es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "ID de usuario inválido" };
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("-__v");

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    console.log("�️ Usuario eliminado (lógico):", user._id);
    return { success: true, data: user };
  } catch (error) {
    console.error("❌ Error eliminando usuario:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  User,
  saveUser,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
};
