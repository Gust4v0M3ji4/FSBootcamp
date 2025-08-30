// /src/types/chat.ts

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface ChatResponse {
  message: string
}

// Interfaz para los parámetros del LLM
export interface LLMParams {
  temperature: number | null
  top_p: number | null
  top_k: number | null
  reasoning_effort: 'minimal' | 'low' | 'medium' | 'high'
  system_prompt?: string // **[NUEVO]** Un tipo para el prompt del sistema
}

// Interfaz para el cuerpo completo de la solicitud a la API
export interface CompletionRequest {
  input: string
  params: LLMParams
}
