# AI Assistant Pro - Chat con Configuración de LLM

Este proyecto es una interfaz de chat moderna y profesional que permite interactuar con un modelo de lenguaje (LLM) mediante una API, con opciones avanzadas de configuración del modelo directamente desde el frontend.

Diseñado para cumplir con los requisitos del curso, incluye controles para ajustar parámetros clave como temperatura, top-p, top-k y esfuerzo de razonamiento, con validaciones y exclusividad entre métodos de muestreo.

---

## 🚀 Características

- 💬 Interfaz de chat limpia y responsiva
- ⚙️ Sección de configuración integrada junto al input
- 🔧 Ajuste de parámetros del modelo:
  - **Temperatura** `[0, 2]`
  - **Top-P** `[0, 1]`
  - **Top-K** `[0, 20]`
  - **Esfuerzo de razonamiento**: minimal, low, medium, high
- ✅ Validaciones de rango en tiempo real
- 🚫 Exclusividad entre `top_p` y `top_k` (solo se envía uno)
- 📦 Estructura de solicitud al servidor conforme al formato requerido
- 🌐 Comunicación con backend vía `fetch` y `POST`

---

## 📂 Estructura del Proyecto

/src
/components
ChatInterface.tsx → Interfaz principal del chat
ChatSettings.tsx → Panel de configuración de parámetros
MessageBubble.tsx → Componente reutilizable para mensajes
/types
chat.ts → Tipos TypeScript para mensajes y parámetros

---

## 🧩 Tecnologías utilizadas

- **React** + **TypeScript**
- **Tailwind CSS** (estilos modernos y responsivos)
- **@tanstack/react-query** (gestión de solicitudes)
- JavaScript moderno (ES6+)
- Diseño responsive para móviles y escritorio

---

## 📦 Formato del cuerpo enviado al servidor

```json
{
  "input": "Hola, ¿qué puedes hacer?",
  "params": {
    "temperature": 0.8,
    "top_p": 0.9,
    "reasoning_effort": "medium",
    "system_prompt": "Eres un asistente de IA útil..."
  }
}
```
