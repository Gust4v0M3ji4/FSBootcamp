// /src/components/ChatSettings.tsx

import React from 'react'
import type { LLMParams } from '../types/chat'

interface ChatSettingsProps {
  params: LLMParams
  onParamsChange: (newParams: Partial<LLMParams>) => void
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({
  params,
  onParamsChange,
}) => {
  const handleNumericChange = (
    key: 'temperature' | 'top_p' | 'top_k',
    value: string,
  ) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    // ✅ Validaciones de rango
    if (key === 'temperature' && numValue >= 0 && numValue <= 2) {
      onParamsChange({ [key]: numValue })
    } else if (key === 'top_p' && numValue >= 0 && numValue <= 1) {
      onParamsChange({ [key]: numValue })
    } else if (key === 'top_k' && numValue >= 0 && numValue <= 20) {
      onParamsChange({ [key]: Math.floor(numValue) })
    }
  }

  const handleReasoningChange = (value: LLMParams['reasoning_effort']) => {
    onParamsChange({ reasoning_effort: value })
  }

  return (
    <div className="p-4 bg-white border-t border-gray-200 shadow-lg rounded-b-lg space-y-3">
      <h3 className="text-sm font-semibold text-gray-800 border-b pb-2 border-gray-200">
        🔧 Ajustes del Modelo
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {/* Temperatura */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Temperatura [0-2]
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={params.temperature ?? 0.7}
            onChange={(e) => handleNumericChange('temperature', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Preciso</span>
            <span>{(params.temperature ?? 0.7).toFixed(1)}</span>
            <span>Creativo</span>
          </div>
        </div>

        {/* Top-P */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Top-P [0-1] {params.top_p !== null && '(activo)'}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={params.top_p ?? 0}
            onChange={(e) => handleNumericChange('top_p', e.target.value)}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
              params.top_p !== null ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>{params.top_p !== null ? params.top_p.toFixed(2) : '0'}</span>
            <span>1</span>
          </div>
        </div>

        {/* Top-K */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Top-K [0-20] {params.top_k !== null && '(activo)'}
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={params.top_k ?? 0}
            onChange={(e) => handleNumericChange('top_k', e.target.value)}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
              params.top_k !== null ? 'bg-purple-500' : 'bg-gray-200'
            }`}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>{params.top_k ?? 0}</span>
            <span>20</span>
          </div>
        </div>

        {/* Reasoning Effort */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Razonamiento
          </label>
          <select
            value={params.reasoning_effort}
            onChange={(e) =>
              handleReasoningChange(
                e.target.value as 'minimal' | 'low' | 'medium' | 'high',
              )
            }
            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="minimal">Mínimo</option>
            <option value="low">Bajo</option>
            <option value="medium">Medio</option>
            <option value="high">Alto</option>
          </select>
        </div>
      </div>
    </div>
  )
}
