/**let users = [{
    id: 1,
    name: 'Carlos',
    email: 'carlos@gmail.com',
    age: 20
}];
**/
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    }
});

const User = mongoose.model('User', userSchema);

const saveUser = (user, callback) => {
    const { id, name, email, age } = user;
    const newUser = new User({ id, name, email, age });
    // Guardamos en MongoDB
    newUser.save()
    .then(() => {
        console.log('✅ Nuevo user creado!');
        return callback(null, newUser);
    })
    .catch(err => {
        console.error(err);
        return callback(err);
    });
}

const findAllUsers = (callback) => { 
    User.find()
    .then(results => {
        console.log('📋 Todos los users:', results);
        return callback(null, results);
    })
    .catch(err => {
        console.error(err);
        return callback(err);
    });
}

const findUserById = (id, callback) => { 
    User.findOne({ id })
   .then(result => {
    console.log('🔍 Encontrado:', result);
    return callback(null, result);
   })
   .catch(err => {
    console.error(err);
    console.log('🔍 Error:', err);
    return callback(err);
   });
}

const updateUser = (id, user, callback) => { 
    User.findOneAndUpdate({ id }, user, { new: true })
    .then(result => {
        console.log('🔍 Actualizado:', result);
        return callback(null, result);
    })
    .catch(err => {
        console.error(err);
        return callback(err);
    });
}


module.exports = {
    User,
    saveUser,
    findAllUsers,
    findUserById,
    updateUser
};
