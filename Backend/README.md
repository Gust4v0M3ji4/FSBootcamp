# 🚀 Tarea 3 - Backend con Autenticación

Backend con implementación completa de autenticación usando **Basic Auth**, **JWT** y **Sesiones**.

## 📋 Características Implementadas

✅ **Basic Auth → JWT**: Endpoint que recibe credenciales Basic y retorna JWT  
✅ **JSON Login → JWT**: Endpoint que recibe JSON y retorna JWT  
✅ **Autenticación por Sesiones**: Login/logout con cookies  
✅ **CRUD Protegido**: Rutas protegidas con JWT y Sesiones  
✅ **Hash de Passwords**: Usando bcrypt para seguridad  
✅ **Conexión MongoDB**: Persistencia de datos

## �️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

### 3. Inicializar usuarios de prueba

```bash
npm run seed
```

### 4. Iniciar servidor

```bash
npm start
# o
npm run dev
```

Servidor corriendo en: **http://localhost:3001**

## 🔐 Endpoints de Autenticación

### Basic Auth → JWT

```http
GET /api/v1/auths/token
Authorization: Basic <base64(email:password)>
```

**Respuesta:**

```json
{
  "code": "OK",
  "message": "Token generated successfully!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### JSON Login → JWT

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### Session Login

```http
POST /api/v1/auths/session/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Session Logout

```http
POST /api/v1/auths/session/logout
```

### Check Session Status

```http
GET /api/v1/auths/session/status
```

## 👥 Endpoints CRUD de Usuarios

### Rutas Públicas

- `GET /api/v1/users` - Obtener todos los usuarios
- `GET /api/v1/users/query?id=1001` - Obtener usuario por ID
- `POST /api/v1/users` - Crear usuario
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario

### Rutas Protegidas con JWT

- `GET /api/v1/users/protected` - Obtener usuarios (requiere JWT)
- `GET /api/v1/users/protected/query?id=1001` - Obtener usuario por ID (requiere JWT)
- `POST /api/v1/users/protected` - Crear usuario (requiere JWT)
- `PUT /api/v1/users/protected/:id` - Actualizar usuario (requiere JWT)
- `DELETE /api/v1/users/protected/:id` - Eliminar usuario (requiere JWT)

**Uso con JWT:**

```http
GET /api/v1/users/protected
Authorization: Bearer <token>
```

### Rutas Protegidas con Sesión

- `GET /api/v1/users/session-protected` - Obtener usuarios (requiere sesión activa)

## 🧪 Usuarios de Prueba

| Email            | Password | Rol   |
| ---------------- | -------- | ----- |
| admin@test.com   | admin123 | admin |
| user@test.com    | user123  | user  |
| test@example.com | test123  | user  |

## 🔧 Ejemplo de Uso Completo

### 1. Obtener JWT con Basic Auth

```bash
# Codificar credenciales: admin@test.com:admin123
echo -n "admin@test.com:admin123" | base64
# Resultado: YWRtaW5AdGVzdC5jb206YWRtaW4xMjM=

curl -X GET http://localhost:3001/api/v1/auths/token \
  -H "Authorization: Basic YWRtaW5AdGVzdC5jb206YWRtaW4xMjM="
```

### 2. Obtener JWT con JSON

```bash
curl -X POST http://localhost:3001/api/v1/auths/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}'
```

### 3. Usar JWT en rutas protegidas

```bash
curl -X GET http://localhost:3001/api/v1/users/protected \
  -H "Authorization: Bearer <tu-token-jwt>"
```

### 4. Login por sesión

```bash
curl -X POST http://localhost:3001/api/v1/auths/session/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}' \
  -c cookies.txt
```

### 5. Usar sesión en rutas protegidas

```bash
curl -X GET http://localhost:3001/api/v1/users/session-protected \
  -b cookies.txt
```

## 📊 Estados HTTP

| Código | Significado                                             |
| ------ | ------------------------------------------------------- |
| 200    | Operación exitosa                                       |
| 401    | No autorizado (credenciales inválidas o token expirado) |
| 404    | Recurso no encontrado                                   |
| 500    | Error interno del servidor                              |

## 🔒 Seguridad Implementada

- ✅ **Passwords hasheados** con bcrypt (salt rounds: 10)
- ✅ **JWT con expiración** (2 horas)
- ✅ **Sesiones seguras** con cookies
- ✅ **Validación de headers** de autorización
- ✅ **Variables de entorno** para secrets

## 🛡️ Middleware de Autenticación

### JWT Middleware

Protege rutas verificando tokens Bearer:

```javascript
Authorization: Bearer <token>
```

### Session Middleware

Protege rutas verificando sesiones activas:

```javascript
Cookie: sess:id=<session-id>
```

### Basic Auth Middleware

Procesa credenciales Basic para generar tokens:

```javascript
Authorization: Basic <base64(email:password)>
```

## 📝 Logs y Debugging

El servidor proporciona logs claros de:

- ✅ Conexión a MongoDB
- ✅ Autenticación de usuarios
- ✅ Generación de tokens
- ✅ Operaciones CRUD
- ✅ Errores de validación

¡Todo listo para cumplir con los criterios de aceptación de la Tarea 3! 🎉

- Crear operaciones CRUD completas
- Aplicar validaciones con esquemas de datos
- Implementar middlewares personalizados
- Estructurar un proyecto profesional y escalable

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** - Runtime de JavaScript para el servidor
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL local
- **Mongoose** - ODM para MongoDB
- **Express-Validator** - Validación de datos de entrada

### Herramientas de Desarrollo

- **nodemon** - Auto-restart del servidor en desarrollo
- **Git & GitHub** - Control de versiones
- **mongosh** - Shell de MongoDB
- **Homebrew** - Gestor de paquetes para macOS

## 📁 Estructura del Proyecto

```
Bootcamp-2025-Lab-2/
├── controllers/
│   └── v1/
│       └── users.js        # Controladores de usuarios
├── middlewares/
│   └── performance.js      # Middleware de rendimiento
├── models/
│   └── users.js           # Modelo de datos de usuarios
├── schemas/
│   └── users.js           # Esquemas de validación
├── db.js                  # Configuración de base de datos
├── index.js               # Servidor principal con rutas
├── callback.js            # Ejemplos de callbacks
├── package.json           # Dependencias del proyecto
├── package-lock.json      # Lock file de dependencias
└── README.md              # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm (viene con Node.js)
- MongoDB Community Edition
- Git
- Homebrew (para macOS)

### 1. Instalación de MongoDB Local

```bash
# Agregar tap de MongoDB a Homebrew
brew tap mongodb/brew

# Instalar MongoDB Community Edition
brew install mongodb-community

# Iniciar el servicio de MongoDB
brew services start mongodb/brew/mongodb-community
```

### 2. Configuración del Proyecto

```bash
# Clonar el repositorio
git clone <repository-url>
cd Bootcamp-2025-Lab-2

# Instalar dependencias
npm install

# Verificar conexión a MongoDB
mongosh --eval "db.runCommand({ping: 1})"
```

### 3. Ejecutar la Aplicación

```bash
# Modo desarrollo (auto-restart)
npm start

# El servidor estará disponible en http://localhost:3001
```

## 📖 Características Implementadas

### Arquitectura en Capas

1. **Modelos** (`models/`): Definición de esquemas de Mongoose
2. **Controladores** (`controllers/`): Lógica de negocio
3. **Esquemas** (`schemas/`): Validaciones de entrada
4. **Middlewares** (`middlewares/`): Funcionalidades transversales

### API Endpoints

#### Usuarios (CRUD Completo)

| Método | Endpoint                | Descripción                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/users`            | Obtener todos los usuarios |
| GET    | `/api/users/query?id=1` | Obtener usuario por ID     |
| POST   | `/api/users`            | Crear nuevo usuario        |
| PUT    | `/api/users/:id`        | Actualizar usuario         |
| DELETE | `/api/users/:id`        | Eliminar usuario           |

### Ejemplo de Uso

#### Crear Usuario

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "age": 25
  }'
```

#### Obtener Todos los Usuarios

```bash
curl http://localhost:3001/api/users
```

#### Buscar Usuario por ID

```bash
curl http://localhost:3001/api/users/query?id=1
```

## 🔧 Características Técnicas

### Validaciones Implementadas

- Validación de entrada con Express-Validator
- Esquemas de Mongoose con validaciones
- Manejo de errores personalizado

### Middlewares

- **Performance Middleware**: Medición de tiempo de respuesta
- **JSON Parser**: Procesamiento de datos JSON
- **Error Handling**: Manejo centralizado de errores

### Base de Datos

- **MongoDB Local**: Puerto 27017
- **Base de Datos**: `bootcamp2025`
- **Colección**: `users`
- **Auto-incremento**: IDs numéricos personalizados

## 📝 Patrones de Diseño Aplicados

1. **MVC (Model-View-Controller)**: Separación de responsabilidades
2. **Repository Pattern**: Abstracción de acceso a datos
3. **Middleware Pattern**: Funcionalidades transversales
4. **Error Handling Pattern**: Manejo consistente de errores

## 🧪 Testing

### Verificar Funcionamiento

1. **Iniciar MongoDB**:

```bash
brew services start mongodb/brew/mongodb-community
```

2. **Verificar conexión**:

```bash
mongosh --eval "use bootcamp2025; db.users.find()"
```

3. **Probar API**:

```bash
# Obtener usuarios
curl http://localhost:3001/api/users

# Crear usuario de prueba
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@email.com", "age": 30}'
```

## 💡 Conceptos Clave Aprendidos

- Arquitectura en capas para aplicaciones Node.js
- Integración con MongoDB usando Mongoose
- Validación de datos en múltiples capas
- Middlewares personalizados
- Manejo de errores asíncronos
- Patrones de respuesta API consistentes

## 🤝 Comandos Útiles

```bash
# Ver logs de MongoDB
brew services info mongodb-community

# Parar MongoDB
brew services stop mongodb/brew/mongodb-community

# Acceder a MongoDB shell
mongosh

# Ver base de datos actual
mongosh --eval "db.getName()"

# Ver colecciones
mongosh --eval "use bootcamp2025; show collections"
```

## 📞 Contacto

- **Instructor**: Leonardo Larrea
- **Email**: leonardo.larrea1@gmail.com
- **Bootcamp**: MERN 101 - ESPOL

## 📚 Recursos de Referencia

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express.js Guide](https://expressjs.com/es/guide/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT para fines educativos.

---

**Lab 2 - Arquitectura Profesional con MongoDB Local 🚀**

_Construyendo APIs robustas y escalables con el stack MERN._
