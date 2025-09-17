# Bootcamp ESPOL MERN 101 - Lab 2

## 📚 Descripción del Lab

Este repositorio contiene el **Lab 2** del Bootcamp MERN 101 de la ESPOL. En este laboratorio implementamos una API REST completa con arquitectura en capas, conectada a MongoDB local, y aplicando patrones de diseño profesionales.

## 🎯 Objetivos del Lab 2

- Implementar una arquitectura en capas (MVC pattern)
- Conectar a base de datos MongoDB local
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

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Obtener todos los usuarios |
| GET | `/api/users/query?id=1` | Obtener usuario por ID |
| POST | `/api/users` | Crear nuevo usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

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

*Construyendo APIs robustas y escalables con el stack MERN.*