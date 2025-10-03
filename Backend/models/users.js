const User = require("../schemas/users");
const bcrypt = require("bcrypt");

const loginUser = (email, password, callback) => {
  return User.findUserByEmail(email, (err, user) => {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(null, null);
    }

    // Comparar password con hash usando bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return callback(err);
      }
      if (!isMatch) {
        return callback(null, null);
      }
      return callback(null, user);
    });
  });
};

const hashPassword = (password, callback) => {
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, callback);
};

const getAllUsers = (callback) => {
  return User.findAllUsers(callback);
};

const getUserById = (id, callback) => {
  return User.findUserById(id, callback);
};

const getUserByApiKey = (id, callback) => {
  return User.findUserByApiKey(id, callback);
};

const getUserByEmail = (email, callback) => {
  return User.findUserByEmail(email, callback);
};

const saveUser = (user, callback) => {
  // Hash the password before saving
  hashPassword(user.password, (err, hashedPassword) => {
    if (err) {
      return callback(err);
    }
    const userWithHashedPassword = { ...user, password: hashedPassword };
    return User.saveUser(userWithHashedPassword, callback);
  });
};

const updateUser = (id, user, callback) => {
  return User.updateUser(id, user, callback);
};

module.exports = {
  loginUser,
  getAllUsers,
  getUserById,
  getUserByApiKey,
  getUserByEmail,
  saveUser,
  updateUser,
  hashPassword,
};
