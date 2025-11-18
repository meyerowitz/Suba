import axios from 'axios';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import API_CONFIG from '../../config/apiConfig';

// Usar la URL de configuración
const API_URL = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRACK;
const MY_BUS_ID = 'BUS-101-PROTOTIPO';

export default function TrackerScreen() {
    const [errorMsg, setErrorMsg] = useState(null);

    const sendLocation = async (currentLocation) => {
        if (!currentLocation) return;
        const payload = {
            bus_id: MY_BUS_ID,
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            speed: currentLocation.coords.speed
        };
        try {
            console.log("Enviando (Expo Go):", payload);
            await axios.post(API_URL, payload, { timeout: API_CONFIG.TIMEOUT });
            console.log("Enviado (Expo Go) OK");
        } catch (error) {
            console.error("Error al enviar ubicación:", error.message);
            setErrorMsg('Error de red al enviar. ¿API está corriendo?');
        }
    };

    useEffect(() => {
        let intervalId;
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                return;
            }
            intervalId = setInterval(async () => {
                try {
                    let currentLocation = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.High,
                    });
                    await sendLocation(currentLocation);
                } catch (error) {
                    console.warn("Error obteniendo/enviando:", error);
                    setErrorMsg('Error de rastreo: ' + error.message);
                }
            }, 20000); // 20 segundos
        })();
        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tracking Activado (Modo Expo Go)</Text>
            <Text style={styles.apiUrl}>Enviando a: {API_URL}</Text>
            <Text style={styles.busId}>Bus ID: {MY_BUS_ID}</Text>
            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

            <Link href="/pages/MapScreen" asChild>
                <TouchableOpacity style={styles.mapButton}>
                    <Text style={styles.mapButtonText}>Ver Mapa de Buses</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    apiUrl: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
        color: '#666',
    },
    busId: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        marginTop: 15,
        textAlign: 'center'
    },
    mapButton: {
        backgroundColor: '#FF5722',
        padding: 15,
        borderRadius: 8,
        marginTop: 30,
        width: '80%',
        alignItems: 'center',
    },
    mapButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
