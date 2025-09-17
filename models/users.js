const User = require('../schemas/users');


const getAllUsers = (callback) => { 
    return User.findAllUsers(callback);
}

const getUserById = (id, callback) => {
    return User.findUserById(id, callback);
}

const saveUser = (user, callback) => {
    return User.saveUser(user, callback);
}

const updateUser = (id, user, callback) => {
    return User.updateUser(id, user, callback);
}

module.exports = {
    getAllUsers,
    getUserById,
    saveUser,
    updateUser
}