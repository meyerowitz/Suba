// Importar dependencias
require('dotenv').config(); // Carga las variables del .env
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

// Configuración
const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const dbName = 'tracking_db';

// Middlewares
app.use(cors());      // Permite conexiones desde cualquier origen (tu app)
app.use(express.json()); // Permite a la API entender JSON

// Conectar a MongoDB
let db; // Variable para guardar la conexión a la BD
const client = new MongoClient(mongoUri);

client.connect().then(() => {
    console.log('Conectado a MongoDB Atlas');
    db = client.db(dbName);
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

// --- EL ENDPOINT CLAVE ---
// Esta es la URL a la que tu app de Expo llamará
app.post('/api/v1/track', async (req, res) => {

    console.log('Datos recibidos:', req.body);

    // 1. Validar datos (básico)
    const { bus_id, latitude, longitude, speed } = req.body;
    if (!bus_id || latitude == null || longitude == null) {
        return res.status(400).json({ error: 'Faltan datos (bus_id, latitude, longitude)' });
    }

    try {
        // 2. Preparar los datos
        const historyDocument = {
            bus_id: bus_id, // Deberías usar ObjectId(bus_id) si es una referencia
            location: {
                type: 'Point',
                coordinates: [longitude, latitude] // ¡Recuerda: [Longitud, Latitud]!
            },
            speed: speed || 0,
            device_timestamp: new Date(), // O mejor, la fecha que envíe el tlf
            server_timestamp: new Date()
        };

        // 3. Insertar en el historial
        const historyCollection = db.collection('Location_History');
        await historyCollection.insertOne(historyDocument);

        // 4. Actualizar el estado actual (Upsert)
        const statusCollection = db.collection('Bus_Status');
        await statusCollection.findOneAndUpdate(
            { _id: bus_id }, // El filtro (encontrar el bus)
            {
              // Los datos a actualizar
              $set: {
                last_location: historyDocument.location,
                last_speed: historyDocument.speed,
                last_seen: historyDocument.server_timestamp,
                status: "En Ruta"
              }
            },
            { upsert: true } // Si no existe, lo crea
        );

        // 5. Responder al teléfono que todo salió bien
        res.status(200).json({ message: 'Ubicación recibida' });

    } catch (error) {
        console.error('Error al guardar en BD:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// NUEVO ENDPOINT: Obtener ubicaciones en tiempo real de todos los buses
app.get('/api/v1/buses/locations', async (req, res) => {
    try {
        const statusCollection = db.collection('Bus_Status');

        // Obtener todos los buses con su última ubicación
        const buses = await statusCollection.find({}).toArray();

        // Transformar los datos para que sean compatibles con el mapa
        const busLocations = buses.map(bus => ({
            _id: bus._id,
            bus_id: bus._id,
            last_location: bus.last_location,
            last_speed: bus.last_speed,
            last_seen: bus.last_seen,
            status: bus.status
        }));

        res.status(200).json(busLocations);
    } catch (error) {
        console.error('Error al obtener ubicaciones de buses:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener ubicaciones' });
    }
});

// NUEVO ENDPOINT: Obtener ubicación en tiempo real de un bus específico
app.get('/api/v1/buses/:busId/location', async (req, res) => {
    try {
        const { busId } = req.params;
        const statusCollection = db.collection('Bus_Status');

        const bus = await statusCollection.findOne({ _id: busId });

        if (!bus) {
            return res.status(404).json({ error: 'Bus no encontrado' });
        }

        res.status(200).json({
            _id: bus._id,
            bus_id: bus._id,
            last_location: bus.last_location,
            last_speed: bus.last_speed,
            last_seen: bus.last_seen,
            status: bus.status
        });
    } catch (error) {
        console.error('Error al obtener ubicación del bus:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener ubicación' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API de tracking escuchando en http://localhost:${port}`);
});