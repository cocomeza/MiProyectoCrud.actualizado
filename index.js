require('dotenv').config(); 
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb');

const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db;



// Conectar a MongoDB
client.connect()
    .then(() => {
        db = client.db('sample_mflix'); // selecciono la base de datos llamada sample_mflix y se la asigno a la variable db.
        console.log('Conectado a MongoDB');
    })
    .catch(err => console.error('Error al conectar a MongoDB:', err));

    // añadi un middleware a la aplicación Express
app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8"); // con esto el contenido de la respuesta será JSON codificado en UTF-8.
    next();// la use para que la solicitud continúe su ciclo y no se quede estancada en este middleware.
});

// Envío un mensaje en formato JSON con el texto "API DE COMPUTACIÓN", para indicar que la API está funcionando correctamente.

app.get("/", (req, res) => {
    res.json("API DE COMPUTACIÓN");
});

// Endpoint para mostrar productos 

app.get("/productos", async (req, res) => {
    try {
        const productos = await db.collection('productos').find().toArray();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al leer los productos." });
    }
});

// Endpoint para obtener un producto por su ID

 //extraigo el valor del parámetro id de la solicitud (request) y la almaceno en una constante llamada id.
// utilice el await para esperar a que la promesa se resuelva. //utilizo la función findOne para buscar un documento en la colección productos de la base de datos db que tenga un campo codigo igual al valor de id convertido a un número entero con el parseInt.
// Si producto no es null o undefined, se responde con el producto en formato JSON

app.get("/producto/:id", async (req, res) => {
    const { id } = req.params; 
    try {
        const producto = await db.collection('productos').findOne({ codigo: parseInt(id) }); 
        if (producto) {  
            res.json(producto);
        } else {
            res.status(404).json({ error: "Producto no encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al leer los productos." });
    }
});

// Endpoint para filtrar productos por nombre

//obtengo el parámetro nombre de la consulta de la solicitud.
//  Si nombre no está presente,envio una respuesta con un estado 400 y un mensaje de error indicando que se debe ingresar un nombre para buscar productos.

//filtro los productos para encontrar aquellos cuyo nombre contenga la cadena de búsqueda (nombre). use toLowerCase para asegurar que la comparación no sea sensible a mayúsculas.

// Si el arreglo productos está vacío, envio una respuesta con un estado 404 y un mensaje de error indicando que no se encontraron productos que coincidan con la búsqueda.

//Si se encontraron productos, se envía una respuesta JSON con los productos encontrados.

// Si ocurre un error durante el proceso, se captura con catch y se envía una respuesta con un estado 500 y un mensaje de error indicando que hubo un problema al leer los productos.

app.get("/productos/buscar", async (req, res) => {
    let { nombre } = req.query;
    if (!nombre) {
        return res.status(400).json({ error: "Por favor, ingrese un nombre para buscar productos." });
    }
    nombre = nombre.trim().toLowerCase();  
    try {
        // Obtener todos los productos
        const todosLosProductos = await db.collection('productos').find().toArray();
        
        // Filtrar productos que coincidan con el nombre
        const productos = todosLosProductos.filter(producto => 
            producto.nombre.toLowerCase().includes(nombre)
        );

        if (productos.length === 0) {
            return res.status(404).json({ error: "No se encontraron productos que coincidan con la búsqueda." });
        }
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al leer los productos." });
    }
});



const categoriasPermitidas = ["Desktop", "Portátiles", "Accesorios", "Impresoras", "Partes de computadoras", "Monitores"];

// Endpoint para agregar un nuevo producto

// Extraigo las propiedades nombre, categoria y precio del cuerpo de la solicitud (req.body).
// verifico que nombre, categoria y precio estén presentes. Si alguno falta, se responde con un código de estado 400  y un mensaje de error.
// verifico si la categoría proporcionada está en la lista de categoriasPermitidas. Si no está, respondo con un código de estado 400 y un mensaje de error que especifica las categorías permitidas.
// Luego calculo un nuevo código para el producto contando el número de documentos en la colección (productos) y sumándole 1, logrando asi que se cree un objeto nuevoProducto con las propiedades codigo, nombre, categoria y precio.
// Se inserta el nuevo producto en la colección productos de la base de datos.
// Si todo sale bien,  respondo con un código de estado 201 y un mensaje indicando que el producto se agregó correctamente, junto con los detalles del producto.
// Si ocurre algún error en el proceso, se captura en el bloque catch y respondo con un código de estado 500  y un mensaje de error .


app.post("/productos/agregar", async (req, res) => {
    try {
        const { nombre, categoria, precio } = req.body;
        if (!nombre || !categoria || !precio) {
            return res.status(400).json({ error: "Por favor, proporcione nombre, categoría y precio del producto." });
        }
        if (!categoriasPermitidas.includes(categoria.trim())) {
            return res.status(400).json({ error: "Categoría no permitida. Categorías permitidas: Desktop, Portátiles, Accesorios, Impresoras, Partes de computadoras, Monitores." });
        }
        const nuevoCodigo = await db.collection('productos').countDocuments() + 1;
        const nuevoProducto = {
            codigo: nuevoCodigo,
            nombre,
            categoria,
            precio
        };
        await db.collection('productos').insertOne(nuevoProducto);
        res.status(201).json({ mensaje: "Producto agregado correctamente.", producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ error: "Se produjo un error al agregar el producto." });
    }
});

// Endpoint para eliminar producto

// capturo el parametro = id: Se obtiene el valor del parámetro id de la URL y se convierte a un entero. Si la conversión falla, id será igual a 0. Esto lo hice para asegurar que el valor de id sea numérico.

// verifico si req.params.id está presente. Si no lo está, se devuelve un error con el código de estado 422  y un mensaje de error indicando un problema en el formato de los datos.

// elimino un documento de la colección productos en la base de datos cuya propiedad codigo coincida con el id proporcionado, utilizando deleteOne.

// verifico si se eliminó algún documento. Si deletedCount es 0, significa que no se encontró ningún producto con ese id y se devuelve un error con el código de estado 404 (Producto no encontrado) y un mensaje indicando que el producto no fue encontrado.

// Si la eliminación fue exitosa, se envía una respuesta JSON con un mensaje indicando que el producto fue eliminado correctamente.

// Si ocurre un error durante el proceso, se captura en el bloque catch y se devuelve una respuesta con el código de estado 500 (Error al eliminar el producto).

app.delete("/producto/:id", async (req, res) => {
    const id = parseInt(req.params.id) || 0;
    if (!req.params.id) {
        return res.status(422).json({ error: "Error en el formato de los datos" });
    }
    try {
        const resultado = await db.collection('productos').deleteOne({ codigo: id });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        res.json({ mensaje: "Producto eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
});


// Endpoint para modificar el precio de un producto por su ID

// obtengo los parametros, Extraigo el id del producto desde los parámetros de la ruta (req.params) y el nuevoPrecio desde el cuerpo de la solicitud (req.body).

// Verifica si nuevoPrecio está presente en el cuerpo de la solicitud.
// Si nuevoPrecio no está proporcionado, responde con un estado 400 y un mensaje de error: "Por favor, proporcione el nuevo precio del producto.".

// Uso el updateOne para actualizar el precio del producto en la colección productos de la base de datos.

// Busca el producto utilizando su codigo, que se convierte a un entero (parseInt(id)) y luego Actualiza el campo precio con el nuevoPrecio.

// Si matchedCount (el número de documentos que coinciden con el filtro) es 0, responde con un estado 404 y un mensaje de error: "Producto no encontrado.

// Si el producto se encuentra y se actualiza correctamente, busca nuevamente el producto actualizado en la base de datos utilizando findOne y Responde con un mensaje de éxito y los detalles del producto actualizado.

app.patch("/producto/:id/modificarprecio", async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoPrecio } = req.body;

        if (!nuevoPrecio) {
            return res.status(400).json({ error: "Por favor, proporcione el nuevo precio del producto." });
        }

        const resultado = await db.collection('productos').updateOne(
            { codigo: parseInt(id) },
            { $set: { precio: nuevoPrecio } }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        const producto = await db.collection('productos').findOne({ codigo: parseInt(id) });
        res.json({ mensaje: "Precio del producto actualizado correctamente.", producto });
    } catch (error) {
        res.status(500).json({ error: "Se produjo un error al modificar el precio del producto." });
    }
});


// Manejo de errores para rutas no existentes

app.use((req, res, next) => {
    res.status(404).json({ error: "Ruta no encontrada." });
});

// Manejo de errores globales

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Error interno del servidor." });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('Desconectado de MongoDB');
    } catch (error) {
        console.error('Error al desconectar de MongoDB:', error);
    } finally {
        server.close(() => {
            console.log('Servidor cerrado');
            process.exit(0);
        });
    }
});
















































































