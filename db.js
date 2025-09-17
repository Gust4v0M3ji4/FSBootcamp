const mongoose = require('mongoose');

// Conexión a MongoDB local
mongoose.connect('mongodb://localhost:27017/bootcamp2025')
  .then(() => console.log('✅ Conectado a MongoDB Local'))
  .catch(err => console.error('❌ Error de conexión a MongoDB Local:', err));


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