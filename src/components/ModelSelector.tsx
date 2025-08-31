// src/components/ModelSelector.tsx
import React from 'react'
import type { WebLLMModelId } from '@/services/webllmService'
import type { InitProgressState } from '@/hooks/useWebLLM' // Importar el tipo

interface ModelSelectorProps {
  selectedModelId: WebLLMModelId
  onModelChange: (id: WebLLMModelId) => void
  isLoading: boolean
  isLoaded: boolean
  onLoadModel: () => void
  initProgressState: InitProgressState // Nuevo prop
  availableModels: readonly { id: WebLLMModelId; name: string }[]
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onModelChange,
  isLoading,
  isLoaded,
  onLoadModel,
  initProgressState, // Nuevo prop
  availableModels,
}) => {
  return (
    <div className="my-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-wrap items-end gap-2">
      <div className="flex-1 min-w-[200px]">
        <label
          htmlFor="model-select"
          className="block text-sm font-medium text-gray-700"
        >
          Modelo Local:
        </label>
        <select
          id="model-select"
          value={selectedModelId}
          onChange={(e) => onModelChange(e.target.value as WebLLMModelId)} // Aserción de tipo segura si las opciones son válidas
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          disabled={isLoading || isLoaded}
        >
          {availableModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onLoadModel}
        disabled={!selectedModelId || isLoading || isLoaded}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          !selectedModelId || isLoading || isLoaded
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-700 text-white'
        }`}
      >
        {isLoading ? 'Cargando...' : isLoaded ? 'Cargado' : 'Cargar Modelo'}
      </button>
      {/* --- Nueva Barra de Progreso --- */}
      {(isLoading || initProgressState.percentage > 0) && !isLoaded && (
        <div className="w-full mt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{initProgressState.text}</span>
            {/* <span>{initProgressState.percentage}%</span> */}{' '}
            {/* Si no se muestra en el texto */}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${initProgressState.percentage}%` }}
            ></div>
          </div>
          {/* Opcional: Mostrar tiempo estimado restante
          {initProgressState.estimatedTimeRemaining !== undefined && (
            <div className="text-xs text-gray-500 mt-1">
              Tiempo estimado restante: {Math.round(initProgressState.estimatedTimeRemaining / 1000)}s
            </div>
          )}
          */}
        </div>
      )}
      {/* ------------------------------ */}
    </div>
  )
}
