const mongoose = require("mongoose");

// Conexión a MongoDB Atlas
const MONGODB_URI =
  "mongodb+srv://gustavojosemejiar5_db_user:oKtCChmvrto1PqOY@cluster0.4lk1pug.mongodb.net/bootcamp2025?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado exitosamente a MongoDB Atlas");
    console.log("🌐 Base de datos: bootcamp2025");
  })
  .catch((err) => {
    console.error("❌ Error de conexión a MongoDB Atlas:", err);
    process.exit(1);
  });

// Evento para monitorear el estado de la conexión
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose conectado a MongoDB Atlas");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error en la conexión de Mongoose:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose desconectado de MongoDB Atlas");
});

module.exports = mongoose;

// // Esquema de Usuario
// const userSchema = new mongoose.Schema({
//   id: {
//     type: Number,
//     unique: true,
//     required: true
//   },
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   age: {
//     type: Number,
//     required: true,
//     min: 0
//   }
// }, {
//   timestamps: true // Agrega createdAt y updatedAt automáticamente
// });

// const User = mongoose.model('User', userSchema);

// // Función para obtener el próximo ID disponible
// async function getNextId() {
//   const lastUser = await User.findOne().sort({ id: -1 });
//   return lastUser ? lastUser.id + 1 : 1;
// }

// // ========== OPERACIONES CRUD ==========

// // CREATE - Crear un nuevo usuario
// async function createUser(userData) {
//   try {
//     const nextId = await getNextId();
//     const user = new User({
//       id: nextId,
//       ...userData
//     });
//     const savedUser = await user.save();
//     return { success: true, data: savedUser };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// // READ - Obtener todos los usuarios
// async function getAllUsers() {
//   try {
//     const users = await User.find().select('-_id -__v').sort({ id: 1 });
//     return { success: true, data: users };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// // READ - Obtener usuario por ID
// async function getUserById(id) {
//   try {
//     const user = await User.findOne({ id }).select('-_id -__v');
//     if (!user) {
//       return { success: false, error: 'Usuario no encontrado' };
//     }
//     return { success: true, data: user };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// // UPDATE - Actualizar usuario por ID
// async function updateUser(id, updateData) {
//   try {
//     const user = await User.findOneAndUpdate(
//       { id },
//       updateData,
//       { new: true, runValidators: true }
//     ).select('-_id -__v');

//     if (!user) {
//       return { success: false, error: 'Usuario no encontrado' };
//     }
//     return { success: true, data: user };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// // DELETE - Eliminar usuario por ID
// async function deleteUser(id) {
//   try {
//     const user = await User.findOneAndDelete({ id }).select('-_id -__v');
//     if (!user) {
//       return { success: false, error: 'Usuario no encontrado' };
//     }
//     return { success: true, data: user };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// // Exportar todas las funciones
// module.exports = {
//   User,
//   createUser,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser
// };
