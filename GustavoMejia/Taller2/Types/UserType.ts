import { z } from "zod"

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