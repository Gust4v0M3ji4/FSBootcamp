// /types/Result.ts

// Si la operación fue exitosa, `success: true` y contiene los datos
// Si falló, `success: false` y contiene el mensaje de error
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

