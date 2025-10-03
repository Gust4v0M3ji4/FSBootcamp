# 🛠️ SOLUCIONES RÁPIDAS PARA MONGODB

## Opción 1: Corregir MongoDB Atlas (RECOMENDADO)

1. Ve a https://cloud.mongodb.com
2. Database Access → Verifica usuario: `gustavojosemejiar5_db_user`
3. Si no existe, crea uno nuevo:

   - Username: `tu_usuario`
   - Password: Genera una nueva (sin caracteres especiales)
   - Database Access: Read and write to any database

4. Network Access → IP Access List

   - Add IP Address → Add Current IP Address
   - O usa: `0.0.0.0/0` (SOLO para desarrollo)

5. Database → Connect → Drivers

   - Copia la URI exacta
   - Reemplaza <username> y <password>

6. Actualiza .env:

```
MONGODB_URI=mongodb+srv://tu_usuario:tu_nueva_password@cluster0.4lk1pug.mongodb.net/bootcamp_tarea3?retryWrites=true&w=majority&appName=Cluster0
```

## Opción 2: Usar MongoDB Atlas Shared (Temporal)

Si sigues teniendo problemas, puedes usar esta URI temporal:

```bash
# URI pública para pruebas (NO usar en producción)
MONGODB_URI=mongodb+srv://demo:demo123@cluster0.sample.mongodb.net/bootcamp_demo?retryWrites=true&w=majority
```

## Opción 3: Instalar MongoDB Local

```bash
# Descargar MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Después de instalar, usar:
MONGODB_URI=mongodb://localhost:27017/bootcamp_tarea3
```

## ✅ Probar Conexión

Después de actualizar .env:

```bash
node test-connection.js
```

Si sale "✅ ¡CONEXIÓN EXITOSA!" entonces:

```bash
npm start
npm run seed
```

## 🚨 Si Nada Funciona

Mándame screenshot de:

1. MongoDB Atlas → Database Access (lista de usuarios)
2. MongoDB Atlas → Network Access (lista de IPs)
3. MongoDB Atlas → Database → Connect (la URI que te da)

¡Y te ayudo a solucionarlo! 🤝
