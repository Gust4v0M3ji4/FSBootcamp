// index.ts
import { createRepositories } from "./factories/createRepositories"
import { validateCreateUser, validateUpdateUser } from "./types/userType"

async function main() {
  const { userRepository } = createRepositories()

  // 📥 Crear un usuario
  const input = {
    name: "Ana",
    age: 25,
    email: "ana@example.com",
    status: "active",
  }

  const validatedCreate = validateCreateUser(input)
  if (!validatedCreate.success) {
    console.error("Error de validación al crear:", validatedCreate.error)
    return
  }

  const created = await userRepository.createUser(validatedCreate.data)
  if (!created.success) return console.error("Error al crear:", created.error)
  console.log("✅ Usuario creado:", created.data)

  // 🔍 Obtener un usuario por ID
  const userId = created.data.id
  const fetched = await userRepository.getUser(userId)
  if (!fetched.success) return console.error("Error al obtener:", fetched.error)
  console.log("👤 Usuario obtenido:", fetched.data)

  // ✏️ Editar usuario
  const updatedData = { name: "Ana Actualizada", age: 26 }
  const validatedUpdate = validateUpdateUser(updatedData)
  if (!validatedUpdate.success) {
    console.error("Error de validación al actualizar:", validatedUpdate.error)
    return
  }

  const updated = await userRepository.updateUser(userId, validatedUpdate.data)
  if (!updated.success) return console.error("Error al actualizar:", updated.error)
  console.log("🔄 Usuario actualizado:", updated.data)

  // 📋 Obtener todos los usuarios
  const all = await userRepository.getUsers()
  if (!all.success) return console.error("Error al obtener lista:", all.error)
  console.log("📚 Todos los usuarios:", all.data)

  // 🗑️ Eliminar usuario
  const deleted = await userRepository.deleteUser(userId)
  if (!deleted.success) return console.error("Error al eliminar:", deleted.error)
  console.log("🗑️ Usuario eliminado:", deleted.data)
}

main()