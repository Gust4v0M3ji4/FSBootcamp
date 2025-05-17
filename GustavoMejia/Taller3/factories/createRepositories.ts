// /factories/createRepositories.ts
import { UserApiDataSource } from "../datasources/UserApiDataSource"
import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl"

// 🔧 Fábrica que crea todos los repositorios
export function createRepositories() {
  const userApiDataSource = new UserApiDataSource()
  const userRepository = new UserRepositoryImpl(userApiDataSource)

  return {
    userRepository,
  }
}