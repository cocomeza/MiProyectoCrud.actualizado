Instalate los paquetes necesarios (express,dotenv , mongodb, y nodemon para desarrollo).

Cree un archivo index.js donde configure y cree mi servidor Express.

Configure el servidor para escuchar en el puerto definido en las variables de entorno o el puerto 3000 por defecto.

Utilize dotenv para manejar las variables de entorno, específicamente la URI de MongoDB (MONGO_URI) y el puerto (PORT). 

Defini  los scripts: start para iniciar el servidor normalmente y dev para iniciar el servidor con nodemon, cuando ejecuto "node --watch index.js", inicia la aplicación Node.js con nodemon, permitiendo un desarrollo más eficiente al reiniciar automáticamente el servidor.

src/mongodb.js: la conexión y desconexión de MongoDB.

.gitignore: para ignorar archivos y carpetas por Git .

Configure la conexión a MongoDB usando el cliente de MongoDB (MongoClient) 

En cuanto al manejo de errores implemente un middleware para manejar rutas no existentes, devolviendo un error 404.

Implemente un middleware global para manejar errores, devolviendo un error 500 y logueando el stack trace. 

Defini varias rutas (endpoints) para manejar diferentes operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre la colección productos. 

Cree los Endpoints:

GET /: Responde con un mensaje básico para indicar que la API está funcionando. "API COMPUTACION".

GET /productos: Devuelve todos los productos en la colección. GET /producto/:id: Devuelve un producto específico buscando por su código.

GET /productos/buscar: Busca productos por nombre utilizando una expresión regular para hacer la búsqueda insensible a mayúsculas y minúsculas.

POST /productos/agregar: Agrega un nuevo producto a la colección. Valida que se proporcionen todos los campos requeridos (nombre, categoría y precio) y que la categoría sea válida. Asigna un nuevo código al producto basado en el número de documentos actuales en la colección.

PATCH /producto/:id/modificar-precio: Actualiza el precio de un producto específico identificado por su código. Valida que se proporcione un nuevo precio. 

Postman

Probar que la API está funcionando

Método: GET

URL: http://localhost:3000/
Respuesta esperada: "API DE COMPUTACIÓN"

2. Obtener todos los productos
URL: http://localhost:3000/productos

3. Obtener un producto por su ID
URL: http://localhost:3000/producto/{id}
Ejemplo: http://localhost:3000/producto/1

4. Buscar productos por nombre
URL: http://localhost:3000/productos/buscar?nombre={nombre}
Ejemplo: http://localhost:3000/productos/buscar?nombre=Laptop

5. Agregar un nuevo producto

Método: POST

URL: http://localhost:3000/productos/agregar

6. Eliminar un producto por su ID
Método: DELETE

URL: http://localhost:3000/producto/{id}
Ejemplo: http://localhost:3000/producto/7

7. Modificar el precio de un producto por su ID

Método: PATCH

URL: http://localhost:3000/producto/{id}/modificarprecio 

Reemplazo el {id} con el código del producto que deseo modificar y en el body agrego ej:
{
    "nuevoPrecio": 1000
}


