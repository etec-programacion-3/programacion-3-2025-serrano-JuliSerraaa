# programacion-3-2025-serrano-JuliSerraaa
programacion-3-2025-serrano-JuliSerraaa created by GitHub Classroom

MiEcommerce - Plataforma de E-commerce con Chat Integrado
Descripción del Proyecto

MiEcommerce es una plataforma completa de comercio electrónico desarrollada con React en el frontend y Node.js/Express en el backend, utilizando SQLite como base de datos. Incluye un sistema de mensajería integrado para facilitar la comunicación entre compradores y vendedores.

---

✨ Características Principales:

🏪 Catálogo de productos - Visualización y gestión de productos

🔐 Sistema de autenticación - Registro y login de usuarios

💬 Chat en tiempo real - Comunicación directa comprador-vendedor

🛒 Sistema de compras simplificado - Proceso de compra con un clic

---

🚀 Requisitos del Sistema
Versiones Probadas y Compatibles:

Node.js: 18.x o superior (Probado con 22.20.0)
npm: 9.x o superior (Probado con 10.9.3)
Navegador web moderno (Chrome, Firefox, Safari, Edge)

Verificación de Compatibilidad
El proyecto ha sido probado y funciona correctamente con:

✅ Node.js 22.20.0 - Versión actualmente usada
✅ npm 10.9.3 - Versión actualmente usada
✅ Versiones anteriores compatibles: Node.js 18+ y npm 8+

---

Verificar Versiones:

# Verificar Node.js
node --version

# Verificar npm
npm --version
Si necesitas cambiar la versión de Node.js, puedes usar nvm:

#Clonar repositorio
git clone <url-del-repositorio>
cd miecommerce
---

---
Paso 2: Configurar el Backend
Terminal 1 - Backend:

# Navegar a la carpeta del backend
cd backend

# Instalar dependencias
npm install
---

---
Terminal 2 - Frontend:

# Navegar a la carpeta del frontend (desde la raíz del proyecto)
cd frontend

# Instalar dependencias
npm install
---

---
Terminal 1 - Backend (Puerto 3000)
bash
cd backend
npm start
---

---
✅ Deberías ver:

text
Servidor Express corriendo en http://localhost:3000
Modelos sincronizados con la base de datos (Tablas creadas/actualizadas).
---

---
Terminal 2 - Frontend (Puerto 5173)
bash
cd frontend
npm run dev
✅ Deberías ver:

text
  VITE v4.4.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
👤 Guía de Uso - Flujo de Prueba Recomendado
---

---
Paso 1: Registro de Usuarios
Abrir http://localhost:5173 en el navegador
---

---
#Registrar Usuario 1 (Vendedor):

Username: vendedor1

Email: vendedor1@test.com

Password: Password123
---

---
#Registrar Usuario 2 (Comprador):

Cerrar sesión del primer usuario (haciendo clic en "Cerrar Sesión")

Registrarse con:

Username: comprador1

Email: comprador1@test.com

Password: Password123
---

---
Paso 2: Crear Productos (Como Vendedor1)
Iniciar sesión como vendedor1

Hacer clic en "Vender" en la barra de navegación

Crear varios productos:

Producto A:

Nombre: iPhone 13 Pro

Tipo: Electrónica

Precio: 999.99

Producto B:

Nombre: Zapatillas Running Nike

Tipo: Deportes

Precio: 129.99
---

---
Paso 3: Probar Compras y Chat (Como Comprador1)
Cerrar sesión e iniciar sesión como comprador1

Navegar por el catálogo de productos

Probar flujo de compra:

Opción A: Compra Directa
Hacer clic en un producto del vendedor1

Hacer clic en "💰 Comprar Ahora"
---

---
✅ Verificar que:

Se crea automáticamente una conversación

Se envía mensaje automático de compra

Se redirige al chat con el vendedor
---

---
Opción B: Contactar antes de Comprar
Hacer clic en otro producto del vendedor1

Hacer clic en "💬 Contactar al Vendedor"

✅ Verificar que:

Se crea conversación con mensaje de interés

Se redirige al chat
---

---
Paso 4: Probar el Chat (Como Vendedor1)
Cerrar sesión e iniciar sesión como vendedor1

Hacer clic en "Mensajes" en la barra de navegación

✅ Verificar que:

Aparecen las conversaciones con compradores

Se pueden enviar y recibir mensajes en tiempo real

Los mensajes se actualizan automáticamente (polling cada 3 segundos)
---

---
🧪 Casos de Prueba Específicos
✅ Prueba de Autenticación
Registro de nuevo usuario

Inicio de sesión

Protección de rutas privadas

Cierre de sesión
---

---
✅ Prueba de Productos
Creación de productos (solo usuarios autenticados)

Visualización de catálogo público

Edición de productos (solo propietario)

Eliminación de productos (solo propietario)
---

---

✅ Prueba de Compras
Botón "Comprar Ahora" en productos ajenos

Creación automática de conversación

Mensaje automático de compra

Redirección al chat
---

---
✅ Prueba del Chat
Lista de conversaciones

Envío de mensajes

Recepción en tiempo real (polling)

Diferenciación de mensajes propios/ajenos
---

---
🔧 Troubleshooting
Problemas Comunes y Soluciones
❌ Error: "Puerto 3000 ya en uso"

# Encontrar proceso usando el puerto
sudo lsof -i :3000

# Terminar proceso
kill -9 <PID>
---

---
# O usar otro puerto (modificar .env)
❌ Error: "Module not found" en el backend
# Reinstalar dependencias del backend
cd backend
rm -rf node_modules package-lock.json
npm install
---

---
❌ Error: "Module not found" en el frontend

# Reinstalar dependencias del frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
---

---
❌ Error: "Base de datos SQLite corrupta"

# Eliminar y regenerar base de datos
cd backend
rm -rf data/database.sqlite
npm start  # Se recreará automáticamente
---

---
❌ Error: CORS en el navegador

Verificar que ambos servidores (frontend/backend) estén corriendo
Revisar que las URLs en frontend/src/api/AxiosConfig.js sean correctas
---

---
❌ Error: "Invalid JWT token"

bash
# Limpiar localStorage del navegador
# O abrir consola y ejecutar:
localStorage.clear()
Comandos Útiles para Debug
bash
# Ver logs del backend
cd backend && npm start

# Ver logs del frontend
cd frontend && npm run dev

# Limpiar caché de npm
npm cache clean --force

# Verificar estado de puertos (Linux/Arch)
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :5173

# Alternativa para ver puertos
ss -tulpn | grep :3000
---

