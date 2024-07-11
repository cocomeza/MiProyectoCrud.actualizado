require("dotenv").config();

const { MongoClient } = require("mongodb");

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);

const connectToMongoDB = async () => {
    try {
        await client.connect(); 
        console.log("Conectado a MongoDB");
        return client;
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        return null;
    }
};

const disconnectFromMongoDB = async () => {
    try {
        await client.close();
        console.log("Desconectado de MongoDB");
    } catch (error) {
        console.error("Error al desconectar de MongoDB:", error);
    }
};

module.exports = {
    connectToMongoDB,
    disconnectFromMongoDB,
};