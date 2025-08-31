// src/services/webllmService.ts
import * as webllm from '@mlc-ai/web-llm'
import type { LLMParams } from '../types/chat' // Asegúrate de que esta ruta sea correcta

// --- Definir Modelos Disponibles para WebLLM ---
export const WEBLLM_MODELS = [
  { id: 'Phi-3-mini-4k-instruct-q4f32_1-MLC', name: 'Phi-3 Mini (Ligero)' },
  { id: 'Llama-3.1-8B-Instruct-q4f32_1-MLC', name: 'Llama 3.1 8B (Potente)' },
  {
    id: 'TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC',
    name: 'TinyLlama (Muy Ligero)',
  },
] as const

export type WebLLMModelId = (typeof WEBLLM_MODELS)[number]['id']
// -----------------------------------------------

// --- Funcion para Generar Texto con WebLLM ---
// Esta función permanece igual
export const generateWithWebLLM = async (
  engine: webllm.MLCEngineInterface | null,
  input: string,
): Promise<string> => {
  if (!engine) throw new Error('Motor WebLLM no inicializado')
  try {
    // Nota: El system_prompt ya no se pasa aquí. Se maneja internamente por WebLLM
    // o se puede incluir en el historial de mensajes si es necesario.
    const completion = await engine.chat.completions.create({
      messages: [{ role: 'user', content: input }],
      // Se pueden añadir otros parámetros compatibles con la API de chat aquí
    })
    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error generando con WebLLM:', error)
    throw new Error(
      `Error en generacion: ${error instanceof Error ? error.message : 'Desconocido'}`,
    )
  }
}
// ---------------------------------------------

// --- Función para Cargar el Modelo (Versión Simplificada) ---
// Esta función SOLO crea el engine. El progreso se manejará fuera.
export const loadModel = async (
  selectedModelId: WebLLMModelId,
  // onProgress ya NO se pasa aquí para evitar conflictos de firma por ahora
): Promise<webllm.MLCEngineInterface> => {
  console.log('1. Iniciando creación del engine para:', selectedModelId)
  try {
    // --- LLAMADA MÍNIMA Y MÁS ESTÁNDAR ---
    // Solo pasamos el modelId. WebLLM debería encargarse del worker.
    // Si esto falla, probaremos la otra firma en el hook.
    const engine = await webllm.CreateWebWorkerMLCEngine(selectedModelId)
    // ------------------------------------
    console.log('4. Engine creado exitosamente para:', selectedModelId)
    return engine
  } catch (error: any) {
    console.error(
      '5. Error al crear engine para modelo:',
      selectedModelId,
      error,
    )
    // Loggear el mensaje exacto del error
    const errorMessage =
      error.message || error.toString() || 'Error desconocido en loadModel'
    console.error('5a. Mensaje de error detallado:', errorMessage)
    throw new Error(
      `Fallo al inicializar el modelo ${selectedModelId}: ${errorMessage}`,
    )
  }
}
// -------------------------------------------------------------

// NOTA: generateSystemPrompt se mueve de vuelta a ChatInterface.tsx
// para evitar problemas de importación y porque es lógica del componente.
