// /repositories/UserRepositoryImpl.ts
import { UserRepository } from "./UserRepository"
import { UserApiDataSource } from "../datasources/UserApiDataSource"
import { CreateUser, UpdateUser, User } from "../types/userType"
import { Result } from "../types/resultType"

// Esta clase IMPLEMENTA el contrato UserRepository // A FUTURO SE PUEDE IMPLEMENTAR TEST DESARROLLO ETC CON IF
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly dataSource: UserApiDataSource) {}

  async getUsers(): Promise<Result<User[]>> {
    return this.dataSource.getUsers()
  }

  async getUser(id: string): Promise<Result<User>> {
    return this.dataSource.getUser(id)
  }

  async createUser(input: CreateUser): Promise<Result<User>> {
    return this.dataSource.createUser(input)
  }

  async updateUser(id: string, input: UpdateUser): Promise<Result<User>> {
    return this.dataSource.updateUser(id, input)
  }

  async deleteUser(id: string): Promise<Result<null>> {
    return this.dataSource.deleteUser(id)
  }
}