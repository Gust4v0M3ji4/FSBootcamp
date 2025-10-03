require("dotenv").config();
const mongoose = require("./db");
const Users = require("./models/users");

// Usuarios de prueba
const testUsers = [
  {
    id: 1001,
    name: "Admin User",
    email: "admin@test.com",
    age: 30,
    password: "admin123",
    apiKey: "admin-api-key-001",
    role: "admin",
  },
  {
    id: 1002,
    name: "Regular User",
    email: "user@test.com",
    age: 25,
    password: "user123",
    apiKey: "user-api-key-002",
    role: "user",
  },
  {
    id: 1003,
    name: "Test User",
    email: "test@example.com",
    age: 28,
    password: "test123",
    apiKey: "test-api-key-003",
    role: "user",
  },
];

const insertTestUsers = async () => {
  console.log("🔄 Insertando usuarios de prueba...");

  for (const userData of testUsers) {
    try {
      await new Promise((resolve, reject) => {
        Users.saveUser(userData, (err, user) => {
          if (err) {
            if (err.code === 11000) {
              console.log(`⚠️  Usuario ${userData.email} ya existe`);
            } else {
              console.error(
                `❌ Error insertando ${userData.email}:`,
                err.message
              );
            }
            resolve();
          } else {
            console.log(`✅ Usuario ${userData.email} insertado correctamente`);
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(`❌ Error insertando ${userData.email}:`, error);
    }
  }

  console.log("✨ Proceso completado!");
  console.log("🔑 Credenciales de prueba:");
  testUsers.forEach((user) => {
    console.log(`   📧 ${user.email} / 🔐 ${user.password} (${user.role})`);
  });

  process.exit(0);
};

// Esperar conexión y ejecutar
setTimeout(insertTestUsers, 2000);
