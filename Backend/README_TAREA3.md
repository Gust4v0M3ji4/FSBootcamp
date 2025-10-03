# 🚀 Tarea 3 - Sistema de Autenticación Completo

## 📋 Descripción

Sistema de autenticación backend implementando:

- ✅ **Basic Auth → JWT**: Endpoint que recibe credenciales Basic y emite JWT
- ✅ **JSON Login → JWT**: Endpoint que recibe JSON y emite JWT
- ✅ **Sesiones con cookies**: Login/logout con manejo de sesiones
- ✅ **CRUD protegido**: Operaciones protegidas con JWT y sesiones

## 🛠️ Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
# MongoDB Atlas (Reemplaza con tus credenciales)
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/bootcamp_tarea3?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (Cambia por uno seguro)
JWT_SECRET=tu-jwt-secret-super-seguro

# Session Secret (Cambia por uno seguro)
SESSION_SECRET=tu-session-secret-super-seguro

# API Key (Opcional)
API_KEY=tu-api-key-personalizada

# Configuración del servidor
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 2. MongoDB Atlas Setup

Si tienes problemas de conexión:

1. **Verifica credenciales**: Ve a MongoDB Atlas → Database → Connect
2. **Whitelist IP**: Agrega tu IP en Network Access (o usa 0.0.0.0/0 para desarrollo)
3. **Usuario de BD**: Asegúrate que el usuario tenga permisos de lectura/escritura
4. **Password especial**: Si tu password tiene caracteres especiales, encódenla

### 3. Instalación

```bash
npm install
```

### 4. Sembrar datos de prueba

```bash
npm run seed
```

### 5. Iniciar servidor

```bash
npm start
```

## 🌐 Endpoints Implementados

### 🔐 Autenticación

#### 1. Basic Auth → JWT

```http
GET /api/v1/auths/token
Authorization: Basic base64(email:password)
```

**Respuesta:**

```json
{
  "code": "OK",
  "message": "Token generated successfully!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1001,
      "email": "admin@test.com",
      "name": "Admin User",
      "role": "admin"
    },
    "expiresIn": "2h"
  }
}
```

#### 2. JSON Login → JWT

```http
POST /api/v1/auths/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Respuesta:**

```json
{
  "code": "OK",
  "message": "Login successfully!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1001,
      "email": "admin@test.com",
      "name": "Admin User",
      "role": "admin"
    },
    "expiresIn": "2h"
  }
}
```

#### 3. Session Login

```http
POST /api/v1/auths/session/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

#### 4. Session Logout

```http
POST /api/v1/auths/session/logout
```

#### 5. Session Status

```http
GET /api/v1/auths/session/status
```

### 👥 Usuarios

#### Rutas Públicas

- `GET /api/v1/users` - Obtener todos los usuarios
- `POST /api/v1/users` - Crear usuario
- `GET /api/v1/users/query?id=1` - Obtener usuario por ID

#### Rutas Protegidas con JWT

- `GET /api/v1/users/protected` - Obtener usuarios (requiere JWT)

**Usar JWT:**

```http
GET /api/v1/users/protected
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 🧪 Credenciales de Prueba

Después de ejecutar `npm run seed`:

| Usuario      | Email            | Password | Rol   |
| ------------ | ---------------- | -------- | ----- |
| Admin User   | admin@test.com   | admin123 | admin |
| Regular User | user@test.com    | user123  | user  |
| Test User    | test@example.com | test123  | user  |

## 🔧 Pruebas con Postman/Thunder Client

### 1. Probar Basic Auth → JWT

```bash
# En Postman:
# Method: GET
# URL: http://localhost:3001/api/v1/auths/token
# Authorization: Basic Auth
#   Username: admin@test.com
#   Password: admin123
```

### 2. Probar JSON Login

```bash
# Method: POST
# URL: http://localhost:3001/api/v1/auths/login
# Body: raw/JSON
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### 3. Probar JWT en rutas protegidas

```bash
# Method: GET
# URL: http://localhost:3001/api/v1/users/protected
# Authorization: Bearer Token
# Token: [el JWT que obtuviste en pasos anteriores]
```

### 4. Probar Sesiones

```bash
# 1. Login con sesión
# POST http://localhost:3001/api/v1/auths/session/login
# Body: {"email": "admin@test.com", "password": "admin123"}

# 2. Verificar estado de sesión
# GET http://localhost:3001/api/v1/auths/session/status

# 3. Logout
# POST http://localhost:3001/api/v1/auths/session/logout
```

## 🛡️ Seguridad Implementada

- ✅ **Hash de passwords** con bcrypt (salt rounds: 10)
- ✅ **JWT con expiración** (2 horas)
- ✅ **Sessions con cookies** seguras
- ✅ **Variables de entorno** para secrets
- ✅ **Validación de entrada** con express-validator
- ✅ **CORS configurado** para frontend
- ✅ **Códigos de respuesta HTTP** correctos

## 🚨 Solución de Problemas

### Error de conexión MongoDB

```
❌ Error de conexión a MongoDB: MongoServerError: bad auth
```

**Soluciones:**

1. Verifica que las credenciales en `.env` sean correctas
2. En MongoDB Atlas, ve a Network Access y agrega tu IP
3. Asegúrate que el usuario tenga permisos de lectura/escritura
4. Si la password tiene caracteres especiales, encódela

### Error JWT Invalid

```
❌ Invalid token!
```

**Soluciones:**

1. Verifica que el header sea: `Authorization: Bearer tu-token-aqui`
2. Asegúrate que el token no haya expirado (2h)
3. Verifica que JWT_SECRET sea el mismo al generar y validar

### Error de sesión

```
❌ No active session found!
```

**Soluciones:**

1. Asegúrate de hacer login primero en `/api/v1/auths/session/login`
2. Usa el mismo cliente/navegador para mantener cookies
3. Verifica que SESSION_SECRET esté configurado

## 📁 Estructura del Proyecto

```
Backend/
├── controllers/v1/
│   ├── auths.js          # Endpoints de autenticación
│   └── users.js          # CRUD de usuarios
├── middlewares/
│   ├── basicAuth.js      # Middleware Basic Auth
│   ├── jwtAuth.js        # Middleware JWT
│   └── session.js        # Middleware de sesiones
├── models/
│   └── users.js          # Lógica de negocio usuarios
├── schemas/
│   └── users.js          # Schema MongoDB usuarios
├── .env                  # Variables de entorno
├── .env.example          # Ejemplo de variables
├── db.js                 # Conexión MongoDB
├── index.js              # Servidor principal
└── seedUsers.js          # Script para datos de prueba
```

## ✅ Criterios de Aceptación Cumplidos

- ✅ **Servidor en puerto 3001**
- ✅ **Conexión MongoDB estable** (con logs claros)
- ✅ **Basic Auth → JWT** funcional
- ✅ **JSON Login → JWT** funcional
- ✅ **Sesiones login/logout** funcionales
- ✅ **CRUD protegido** con JWT y sesiones
- ✅ **Estados HTTP correctos** (401, 500, 200, etc.)
- ✅ **JWT con expiración** (2 horas)

## 🎥 Para Demo en Video

1. **Mostrar Basic Auth → JWT:**

   - Usar Postman con Basic Auth
   - Copiar JWT obtenido

2. **Mostrar JWT en ruta protegida:**

   - Usar JWT en `/api/v1/users/protected`
   - Mostrar datos del usuario autenticado

3. **Mostrar sesiones:**
   - Login en `/api/v1/auths/session/login`
   - Verificar estado en `/api/v1/auths/session/status`
   - Logout en `/api/v1/auths/session/logout`

¡Proyecto completado y listo para entrega! 🎉
