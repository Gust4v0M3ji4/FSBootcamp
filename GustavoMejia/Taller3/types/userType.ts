import { z } from "zod"
import { Result } from "./resultType"

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().int().positive().max(100),
  email: z.string().email(),
  status: z.enum(["active", "inactive"])
})

export type User = z.infer<typeof userSchema>

export const createUserSchema = userSchema.omit({ id: true })
export type CreateUser = z.infer<typeof createUserSchema>

export const updateUserSchema = userSchema.partial()
export type UpdateUser = z.infer<typeof updateUserSchema>


// 5. Funciones de validación
export function validateCreateUser(input: unknown): Result<CreateUser> {
    const result = createUserSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.message }
    }
    return { success: true, data: result.data }
  }
  
  export function validateUpdateUser(input: unknown): Result<UpdateUser> {
    const result = updateUserSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.message }
    }
    return { success: true, data: result.data }
  }