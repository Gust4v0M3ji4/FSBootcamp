const UserSchema = require("../schemas/users");

// Convertir funciones callback a async/await
const getAllUsers = async (options = {}) => {
  return await UserSchema.findAllUsers(options);
};

const getUserById = async (id) => {
  return await UserSchema.findUserById(id);
};

const saveUser = async (userData) => {
  return await UserSchema.saveUser(userData);
};

const updateUser = async (id, updateData) => {
  return await UserSchema.updateUser(id, updateData);
};

const deleteUser = async (id) => {
  return await UserSchema.deleteUser(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  saveUser,
  updateUser,
  deleteUser,
};
