# Personalización de la Web App para LLM

Este proyecto consiste en la mejora de una interfaz web para interactuar con un modelo de lenguaje (LLM), agregando opciones de personalización avanzada desde el frontend. La aplicación permite ajustar parámetros clave del modelo, validar entradas y garantizar el formato correcto de la solicitud enviada al servidor.

La solución cumple con todos los requisitos solicitados, priorizando una experiencia de usuario clara, funcional y técnica.

---

## Que se implemento?

Se partió del proyecto inicial del frontend y se realizaron las siguientes mejoras:

### 1. Seccion de configuracion junto al input

- Se agregó un botón de ajustes justo en la barra de entrada.
- Al hacer clic, se despliega un panel con los controles necesarios.
- Esta ubicación mejora la usabilidad, manteniendo las opciones accesibles sin saturar la interfaz principal.

### 2. Controles para los parametros del modelo

Se implementaron inputs para:

- **Temperatura** (`temperature`)
- **Top-P** (`top_p`)
- **Top-K** (`top_k`)
- **Esfuerzo de razonamiento** (`reasoning_effort`)

Todos los controles son intuitivos: sliders para valores numéricos y un selector para el nivel de razonamiento.

### 3. Validaciones necesarias

Se aplicaron validaciones en tiempo real para garantizar que los valores estén dentro de los rangos permitidos:

- `temperature`: entre **0 y 2**
- `top_p`: entre **0 y 1**
- `top_k`: entre **0 y 20**
- `reasoning_effort`: solo permite valores válidos (`minimal`, `low`, `medium`, `high`)

Estas validaciones se realizan tanto en el frontend como antes de enviar la solicitud.

### 4. Exclusividad entre `top_p` y `top_k`

Un requisito clave fue: **solo se debe enviar uno de los dos parámetros, nunca ambos**.

**Solucion implementada**:

- En el estado del componente `ChatInterface`, al cambiar `top_p`, se establece `top_k` en `null`.
- Y viceversa: al cambiar `top_k`, se pone `top_p` en `null`.
- Esto se maneja en la función `handleParamsChange` usando una actualización atómica del estado.
- Al construir la solicitud, se usa el operador spread (`...`) para incluir solo el parámetro no nulo.

Ejemplo:

```js
const requestBody = {
  input: message,
  params: {
    temperature: 0.8,
    reasoning_effort: 'medium',
    ...(top_p !== null ? { top_p } : {}),
    ...(top_k !== null ? { top_k } : {}),
  },
}
```

### 5. Formato correcto del cuerpo de la solicitud

La estructura del objeto enviado al servidor sigue exactamente el formato solicitado:

````json
{
  "input": "mensaje del usuario",
  "params": {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": null,
    "reasoning_effort": "medium"
  }
}


# Personalización de la Web App para LLM

Este proyecto consiste en la mejora de una interfaz web para interactuar con un modelo de lenguaje (LLM), agregando opciones de personalización avanzada desde el frontend. La aplicación permite ajustar parámetros clave del modelo, validar entradas y garantizar el formato correcto de la solicitud enviada al servidor.

La solución cumple con todos los requisitos solicitados, priorizando una experiencia de usuario clara, funcional y técnica.

---

## Que se implemento?

Se partió del proyecto inicial del frontend y se realizaron las siguientes mejoras:

### 1. Seccion de configuracion junto al input

* Se agregó un botón de ajustes justo en la barra de entrada.
* Al hacer clic, se despliega un panel con los controles necesarios.
* Esta ubicación mejora la usabilidad, manteniendo las opciones accesibles sin saturar la interfaz principal.

### 2. Controles para los parametros del modelo

Se implementaron inputs para:

* **Temperatura** (`temperature`)
* **Top-P** (`top_p`)
* **Top-K** (`top_k`)
* **Esfuerzo de razonamiento** (`reasoning_effort`)

Todos los controles son intuitivos: sliders para valores numéricos y un selector para el nivel de razonamiento.

### 3. Validaciones necesarias

Se aplicaron validaciones en tiempo real para garantizar que los valores estén dentro de los rangos permitidos:

* `temperature`: entre **0 y 2**
* `top_p`: entre **0 y 1**
* `top_k`: entre **0 y 20**
* `reasoning_effort`: solo permite valores válidos (`minimal`, `low`, `medium`, `high`)

Estas validaciones se realizan tanto en el frontend como antes de enviar la solicitud.

### 4. Exclusividad entre `top_p` y `top_k`

Un requisito clave fue: **solo se debe enviar uno de los dos parámetros, nunca ambos**.

**Solucion implementada**:

* En el estado del componente `ChatInterface`, al cambiar `top_p`, se establece `top_k` en `null`.
* Y viceversa: al cambiar `top_k`, se pone `top_p` en `null`.
* Esto se maneja en la función `handleParamsChange` usando una actualización atómica del estado.
* Al construir la solicitud, se usa el operador spread (`...`) para incluir solo el parámetro no nulo.

Ejemplo:

```js
const requestBody = {
    input: message,
    params: {
        temperature: 0.8,
        reasoning_effort: 'medium',
        ...(top_p !== null ? { top_p } : {}),
        ...(top_k !== null ? { top_k } : {}),
    },
};
````

### 5. Formato correcto del cuerpo de la solicitud

La estructura del objeto enviado al servidor sigue exactamente el formato solicitado:

```json
{
  "input": "mensaje del usuario",
  "params": {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": null,
    "reasoning_effort": "medium"
  }
}
```
