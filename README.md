
# 🧠 API REST de Productos - Computación

Este proyecto es una API REST desarrollada con **Node.js**, **Express** y **MongoDB**, diseñada para gestionar operaciones CRUD sobre una colección de productos del rubro computación.

---

## 🚀 Tecnologías utilizadas

- **Node.js**
- **Express**
- **MongoDB** con `MongoClient`
- **dotenv** – Para manejar variables de entorno
- **nodemon** – Para desarrollo en tiempo real

---

## 📁 Estructura del proyecto

```
project/
├── index.js              # Archivo principal del servidor
├── src/
│   └── mongodb.js        # Configuración de conexión a MongoDB
├── .env                  # Variables de entorno (no se sube al repo)
├── .gitignore            # Ignora archivos/carpeta como node_modules
├── package.json
└── README.md
```

---

## ⚙️ Configuración inicial

1. Instalar los paquetes necesarios:

```bash
npm install express dotenv mongodb
npm install --save-dev nodemon
```

2. Crear archivo `index.js` y configurar el servidor Express.

3. Configurar puerto desde variables de entorno `.env` o usar el `3000` por defecto:

```env
PORT=3000
MONGO_URI=tu_uri_de_mongodb
```

4. Scripts definidos en `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

## 🔌 Conexión a MongoDB

La conexión se gestiona desde `src/mongodb.js` utilizando el cliente `MongoClient` de MongoDB. También incluye una función para desconectar.

---

## 🧱 Middlewares implementados

- **404 Not Found**: Middleware para rutas no existentes.
- **500 Error Interno**: Middleware global para errores, mostrando el stack trace.

---

## 🧪 Endpoints disponibles

### ✔️ Verificar funcionamiento

- **GET /**  
  `http://localhost:3000/`  
  ➜ Respuesta: `"API DE COMPUTACIÓN"`

---

### 📦 Productos

- **GET /productos**  
  Devuelve todos los productos.

- **GET /producto/:id**  
  Devuelve un producto por su código.  
  Ejemplo:  
  `http://localhost:3000/producto/1`

- **GET /productos/buscar?nombre={nombre}**  
  Búsqueda por nombre (insensible a mayúsculas).  
  Ejemplo:  
  `http://localhost:3000/productos/buscar?nombre=Laptop`

---

### ➕ Agregar producto

- **POST /productos/agregar**  
  Crea un nuevo producto.  
  Campos requeridos en el `body`:

```json
{
  "nombre": "Monitor 24''",
  "categoria": "pantallas",
  "precio": 1200
}
```

- Asigna un nuevo código basado en el número de productos actuales.
- Valida campos obligatorios y categoría válida.

---

### ✏️ Modificar precio

- **PATCH /producto/:id/modificar-precio**  
  Modifica el precio de un producto específico.

```json
{
  "nuevoPrecio": 1000
}
```

---

### 🗑️ Eliminar producto

- **DELETE /producto/:id**  
  Elimina el producto con el código especificado.  
  Ejemplo:  
  `http://localhost:3000/producto/7`

---



