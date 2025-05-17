// /repositories/UserRepository.ts
import { CreateUser, UpdateUser, User } from "../types/userType"
import { Result } from "../types/resultType"

// Esta interfaz define lo que un repositorio de usuarios debe poder hacer
export interface UserRepository {
  getUsers(): Promise<Result<User[]>>
  getUser(id: string): Promise<Result<User>>
  createUser(input: CreateUser): Promise<Result<User>>
  updateUser(id: string, input: UpdateUser): Promise<Result<User>>
  deleteUser(id: string): Promise<Result<null>>
}