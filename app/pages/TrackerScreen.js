import axios from 'axios';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// --- ¡ASEGÚRATE QUE ESTA IP SEA LA DE TU PC! ---
const API_URL = 'http://192.168.1.118:3000/api/v1/track'; 
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
            await axios.post(API_URL, payload, { timeout: 5000 });
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
            <Text>Enviando a: {API_URL}</Text>
            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
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
    error: {
        color: 'red',
        marginTop: 15,
        textAlign: 'center'
    }
});