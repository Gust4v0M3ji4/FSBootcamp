import { User, CreateUser, UpdateUser, userSchema, createUserSchema } from "../Types/UserType"
import { Result } from "../Types/ResultType"

const API_URL = "https://68289ad66075e87073a454fb.mockapi.io/api/v1/users"

export async function getUsers(): Promise<Result<User[]>> {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error("Error al obtener los usuarios")
    const data = await res.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function getUser(id: string): Promise<Result<User>> {
  try {
    const res = await fetch(`${API_URL}/${id}`)
    if (!res.ok) throw new Error("Usuario no encontrado")
    const data = await res.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function createUser(input: CreateUser): Promise<Result<User>> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })

    const data = await res.json()
    const result = userSchema.safeParse(data)
    if (!result.success) throw new Error("Respuesta inválida del servidor")

    return { success: true, data: result.data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUser(id: string, updates: UpdateUser): Promise<Result<User>> {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    })

    const data = await res.json()
    const result = userSchema.safeParse(data)
    if (!result.success) throw new Error("Respuesta inválida del servidor")

    return { success: true, data: result.data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteUser(id: string): Promise<Result<null>> {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("No se pudo eliminar el usuario")
    return { success: true, data: null }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
