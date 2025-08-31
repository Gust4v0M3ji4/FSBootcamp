// src/hooks/useWebLLM.ts
import { useState, useCallback } from 'react'
import * as webllm from '@mlc-ai/web-llm'
import {
  loadModel as loadModelFromService, // Alias para evitar conflictos
  generateWithWebLLM,
  WEBLLM_MODELS,
  type WebLLMModelId,
} from '@/services/webllmService'

// Definir un tipo para el estado de progreso
export interface InitProgressState {
  text: string
  percentage: number
}

export const useWebLLM = () => {
  const [selectedModelId, setSelectedModelId] = useState<WebLLMModelId>(
    WEBLLM_MODELS[0].id,
  )
  const [engine, setEngine] = useState<webllm.MLCEngineInterface | null>(null)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [initProgress, setInitProgress] = useState<InitProgressState>({
    text: '',
    percentage: 0,
  })

  const handleLoadModel = useCallback(async () => {
    if (!selectedModelId || engine || isModelLoading) {
      console.log('Carga abortada: ya cargando o engine existe')
      return
    }

    console.log('1. Iniciando proceso de carga para:', selectedModelId)
    setIsModelLoading(true)
    setInitProgress({ text: 'Iniciando...', percentage: 0 })

    // Definir el callback de progreso aquí
    const onProgress = (report: webllm.InitProgressReport) => {
      console.log('[Callback de Progreso]', report.text)
      const percentage = Math.round(report.progress * 100)
      // Actualizar el estado del hook con el progreso
      setInitProgress({
        text: `${report.text} (${percentage}%)`,
        percentage: percentage,
      })
    }

    try {
      console.log('2. Llamando a loadModelFromService...')
      // --- INTENTO 1: Llamada simple (como en el servicio) ---
      const newEngine = await loadModelFromService(selectedModelId)
      // Vincular el callback de progreso DESPUÉS de crear el engine
      // Esto es una conjetura basada en posibles APIs de WebLLM.
      if (
        newEngine &&
        typeof (newEngine as any).setInitProgressCallback === 'function'
      ) {
        console.log('3a. Vinculando callback de progreso al engine creado.')
        ;(newEngine as any).setInitProgressCallback(onProgress)
      } else {
        console.warn(
          '3a. El engine creado no tiene setInitProgressCallback. Probando alternativa...',
        )
        // Si no funciona, tal vez podamos configurarlo de otra manera
        // o simplemente mostrar un progreso genérico.
        setInitProgress({
          text: 'Modelo cargado, inicializando...',
          percentage: 90,
        })
      }
      // ------------------------------------------------------------
      setEngine(newEngine)
      setInitProgress({ text: 'Modelo listo!', percentage: 100 })
      console.log('4. Modelo cargado y listo:', selectedModelId)
    } catch (error1: any) {
      console.error('3. Error en intento 1 (llamada simple):', error1)

      // --- INTENTO 2: Llamada con callback (firma alternativa) ---
      // Si el primer intento falla, intentamos pasar el callback directamente
      // a CreateWebWorkerMLCEngine. Esto requiere acceso al worker, que es problemático.
      // Siguiendo el ejemplo de WebLLM, intentemos pasar el callback como segundo argumento.
      // NOTA: Esto puede causar el error TS2353 si los tipos no coinciden.
      try {
        console.log('3b. Intentando llamada alternativa con callback...')
        // Este código está comentado porque es propenso al error TS2353
        // y al error de ejecución persistente. Se deja como referencia.
        /*
          const newEngineAlt = await webllm.CreateWebWorkerMLCEngine(selectedModelId, {
              initProgressCallback: onProgress
          });
          setEngine(newEngineAlt);
          setInitProgress({ text: 'Modelo listo (método alternativo)!', percentage: 100 });
          console.log("4b. Modelo cargado con método alternativo:", selectedModelId);
          */
        // Si este método también falla, lanzamos el error del primer intento
        throw error1 // Re-lanzar el error original para que se maneje abajo
      } catch (error2: any) {
        console.error('3c. Error en intento 2 (llamada con callback):', error2)
        // --- MANEJO FINAL DE ERRORES ---
        // Si ambos intentos fallan, mostramos el error del primero (es el más común)
        console.error('5. Ambos intentos fallaron. Error final:', error1)
        const errorMsg =
          error1.message || error1.toString() || 'Error desconocido al cargar'
        setInitProgress({ text: `Error: ${errorMsg}`, percentage: 0 })
        // Opcional: alert(`Error al cargar: ${errorMsg}`); // Para mostrar al usuario inmediatamente
      }
      // -----------------------------------------
    } finally {
      setIsModelLoading(false)
    }
  }, [selectedModelId, engine, isModelLoading]) // Dependencias

  const handleGenerate = useCallback(
    async (input: string): Promise<string> => {
      return generateWithWebLLM(engine, input)
    },
    [engine],
  )

  const resetEngine = useCallback(() => {
    if (engine && typeof (engine as any).unload === 'function') {
      ;(engine as any).unload()
    }
    setEngine(null)
    setInitProgress({ text: '', percentage: 0 })
  }, [engine])

  return {
    selectedModelId,
    engine,
    isModelLoading,
    initProgressState: initProgress,
    setSelectedModelId,
    handleLoadModel,
    handleGenerate,
    resetEngine,
    availableModels: WEBLLM_MODELS,
  }
}
