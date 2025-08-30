// /src/components/ChatInterface.tsx

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ChatSettings } from './ChatSettings'
import { MessageBubble } from './MessageBubble'
import type {
  Message,
  ChatResponse,
  LLMParams,
  CompletionRequest,
} from '../types/chat'

// --- API Call ---
async function sendMessage(
  requestBody: CompletionRequest,
): Promise<ChatResponse> {
  const API_URL = 'https://llm-bootcamp.cardor.dev/api/completion' // ✅ sin espacios

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return { message: data.message || data.content || 'Sin respuesta' }
  } catch (error) {
    console.error('Error en fetch:', error)
    throw new Error(
      `Fallo de conexión: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

// --- Generar system_prompt ---
const generateSystemPrompt = (params: LLMParams): string => {
  const temperature = params.temperature ?? 0.7
  const top_p = params.top_p ?? null
  const top_k = params.top_k ?? null
  const reasoning_effort = params.reasoning_effort

  const effortMap = {
    minimal: 'breve y directo',
    low: 'conciso pero claro',
    medium: 'detallado y equilibrado',
    high: 'muy detallado, con razonamiento paso a paso',
  }

  let sampling = 'con muestreo estándar'
  if (top_p !== null && top_p > 0) {
    sampling = `con top_p=${top_p.toFixed(2)}`
  } else if (top_k !== null && top_k > 0) {
    sampling = `con top_k=${top_k}`
  }

  const tempDesc =
    temperature > 1.5
      ? 'muy creativo'
      : temperature > 0.8
        ? 'creativo'
        : 'preciso y enfocado'

  return `Eres un asistente de IA útil y amable. Responde de forma ${effortMap[reasoning_effort]}, ${tempDesc}, ${sampling}. Mantén un tono profesional y claro.`
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const initialParams: LLMParams = {
    temperature: 0.7,
    top_p: 0.9,
    top_k: null,
    reasoning_effort: 'medium',
    system_prompt: '',
  }

  const [llmParams, setLlmParams] = useState<LLMParams>({
    ...initialParams,
    system_prompt: generateSystemPrompt(initialParams),
  })

  // ✅ CORREGIDO: exclusividad entre top_p y top_k
  const handleParamsChange = (newParams: Partial<LLMParams>) => {
    setLlmParams((prev) => {
      let updated = { ...prev, ...newParams }

      // ✅ Validaciones de rango
      if (updated.temperature !== null) {
        updated.temperature = Math.max(0, Math.min(2, updated.temperature))
      }
      if (updated.top_p !== null) {
        updated.top_p = Math.max(0, Math.min(1, updated.top_p))
      }
      if (updated.top_k !== null) {
        updated.top_k = Math.max(0, Math.min(20, updated.top_k))
      }

      // ✅ Exclusividad: si top_p está activo, top_k = null
      if (
        newParams.top_p !== undefined &&
        newParams.top_p !== null &&
        newParams.top_p > 0
      ) {
        updated.top_k = null
      }
      // ✅ Si top_k está activo, top_p = null
      if (
        newParams.top_k !== undefined &&
        newParams.top_k !== null &&
        newParams.top_k > 0
      ) {
        updated.top_p = null
      }

      // ✅ Regenerar prompt
      updated.system_prompt = generateSystemPrompt(updated)
      return updated
    })
  }

  const chatMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        content: data.message,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    },
    onError: (error) => {
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: `❌ ${error.message}`,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || chatMutation.isPending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // ✅ Solo se envía top_p o top_k, no ambos
    const requestBody: CompletionRequest = {
      input: inputValue,
      params: {
        temperature: llmParams.temperature ?? 0.7,
        reasoning_effort: llmParams.reasoning_effort,
        system_prompt: llmParams.system_prompt,
        top_p: llmParams.top_p !== undefined ? llmParams.top_p : null,
        top_k: llmParams.top_k !== undefined ? llmParams.top_k : null,
      },
    }

    chatMutation.mutate(requestBody)
    setInputValue('')
  }

  const clearChat = () => setMessages([])

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">AI Assistant Pro</h1>
        <p className="text-sm text-gray-500">Tu asistente inteligente</p>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full px-4">
        <div
          className={`flex-1 overflow-y-auto transition-all duration-300 px-2 py-4 ${
            hasMessages ? 'mt-0' : 'mt-12'
          }`}
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 flex flex-col items-center justify-center h-64">
              <span className="text-6xl mb-4">🤖</span>
              <h2 className="text-xl font-medium text-gray-700 mb-2">
                Bienvenido al Asistente AI
              </h2>
              <p className="text-gray-500 max-w-xs">
                Escribe tu primera pregunta y comienza a interactuar.
              </p>
            </div>
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}

          {chatMutation.isPending && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow">
                  AI
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Pensando</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {showSettings && (
          <div className="mb-2 transition-all duration-300">
            <ChatSettings
              params={llmParams}
              onParamsChange={handleParamsChange}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-300 shadow-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent mb-4 flex items-center px-3 py-2 gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors ${
              showSettings
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
            aria-label="Configuración"
          >
            ⚙️
          </button>

          <form onSubmit={handleSubmit} className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe un mensaje..."
              disabled={chatMutation.isPending}
              className="w-full outline-none disabled:text-gray-500"
            />
          </form>

          <button
            type="button"
            onClick={clearChat}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
            aria-label="Limpiar chat"
          >
            🗑️
          </button>

          <button
            type="submit"
            form=""
            disabled={!inputValue.trim() || chatMutation.isPending}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            aria-label="Enviar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-90"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
