require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔧 DIAGNÓSTICO DE CONEXIÓN MONGODB ATLAS");
console.log("=========================================\n");

console.log("📋 Información de conexión:");
console.log(
  "URI:",
  process.env.MONGODB_URI ? "Configurada ✅" : "No configurada ❌"
);
console.log(
  "Tipo:",
  process.env.MONGODB_URI?.includes("mongodb+srv")
    ? "MongoDB Atlas"
    : "MongoDB Local"
);
console.log("");

// Función para probar conexión
async function testConnection() {
  try {
    console.log("🔄 Intentando conectar a MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 segundos timeout
    });

    console.log("✅ ¡CONEXIÓN EXITOSA!");
    console.log("📊 Estado de la conexión:", mongoose.connection.readyState);
    console.log("🏷️  Nombre de la base de datos:", mongoose.connection.name);

    // Probar crear una colección simple
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model("ConnectionTest", testSchema);

    console.log("🧪 Probando operación de escritura...");
    const testDoc = new TestModel({ test: "Connection successful!" });
    await testDoc.save();

    console.log("✅ ¡Operación de escritura exitosa!");

    // Limpiar
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log("🧹 Documento de prueba eliminado");
  } catch (error) {
    console.log("❌ ERROR DE CONEXIÓN:");
    console.log("Tipo de error:", error.name);
    console.log("Mensaje:", error.message);

    if (
      error.name === "MongoServerError" &&
      error.message.includes("bad auth")
    ) {
      console.log("\n🔍 DIAGNÓSTICO: Problema de autenticación");
      console.log("✅ Soluciones:");
      console.log("1. Verifica usuario/password en MongoDB Atlas");
      console.log("2. Ve a Database Access y revisa permisos");
      console.log("3. Si la password tiene caracteres especiales, codifícala");
    } else if (error.name === "MongooseServerSelectionError") {
      console.log("\n🔍 DIAGNÓSTICO: No se puede conectar al servidor");
      console.log("✅ Soluciones:");
      console.log("1. Verifica que el cluster esté activo");
      console.log("2. Ve a Network Access y agrega tu IP");
      console.log("3. Usa 0.0.0.0/0 para permitir todas las IPs (desarrollo)");
    }

    console.log("\n🌐 Para revisar configuración:");
    console.log("• https://cloud.mongodb.com");
    console.log("• Database → Connect → Drivers");
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
    process.exit(0);
  }
}

// Ejecutar prueba
testConnection();
