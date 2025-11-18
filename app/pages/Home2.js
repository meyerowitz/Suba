import * as Location from 'expo-location';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Home2() {
	const [ubicacionActual, setUbicacionActual] = useState('Buscando ubicación...');
	const [destinoInput, setDestinoInput] = useState('');
	const [destinoResultado, setDestinoResultado] = useState(null);
	const [cargandoOrigen, setCargandoOrigen] = useState(true);
	const [cargandoDestino, setCargandoDestino] = useState(false);

	// === FUNCIONES DE GEOLOCALIZACIÓN ===

		const obtenerUbicacionOrigen = async () => {
			setCargandoOrigen(true);
			setUbicacionActual('Solicitando permisos...');

			try {
				let { status } = await Location.requestForegroundPermissionsAsync();

				if (status !== 'granted') {
					setUbicacionActual('Permiso de ubicación denegado 😞');
					return;
				}

				setUbicacionActual('Obteniendo coordenadas...');
				let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

				const { latitude, longitude } = location.coords;

				let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

				if (geocode && geocode.length > 0) {
					const addr = geocode[0];
					const formattedAddress = [addr.streetNumber, addr.street, addr.city, addr.country]
						.filter(Boolean)
						.join(', ');
					setUbicacionActual(formattedAddress || 'Dirección no disponible.');
				} else {
					setUbicacionActual('Dirección no disponible. Lat/Lon: ' + latitude.toFixed(4) + '/' + longitude.toFixed(4));
				}

			} catch (error) {
				console.error('Error al obtener la ubicación de origen:', error);
				setUbicacionActual('Error: ' + error.message);
			} finally {
				setCargandoOrigen(false);
			}
		};

	const buscarUbicacionDestino = async () => {
		if (destinoInput.trim().length === 0) {
			Alert.alert('Error', 'Por favor, ingresa una dirección de destino.');
			return;
		}

		setCargandoDestino(true);
		setDestinoResultado(null);

		try {
			let geocode = await Location.geocodeAsync(destinoInput);

			if (geocode && geocode.length > 0) {
				const result = geocode[0];
				setDestinoResultado({
					address: destinoInput,
					latitude: result.latitude,
					longitude: result.longitude,
				});
			} else {
				Alert.alert('Destino no encontrado', 'No se pudieron encontrar coordenadas para la dirección ingresada. Intenta ser más específico.');
			}

		} catch (error) {
			console.error('Error al buscar destino:', error);
			Alert.alert('Error', 'Hubo un error al procesar la búsqueda del destino.');
		} finally {
			setCargandoDestino(false);
		}
	};

	useEffect(() => {
		obtenerUbicacionOrigen();
	}, []);

	// === RENDERIZADO ===
		return (
			<View style={styles.container}>

			<Text style={styles.headerText}>
			Hola, Bienvenido a <Text style={styles.busTrackerText}>Bus Tracker</Text>
			</Text>
			<Text style={styles.sloganText}>
			🚌 Transporte público y seguro en Venezuela 🇻🇪
			</Text>

			<Text style={styles.sectionTitle}>Mi Ubicación Actual (Origen)</Text>
			<View style={styles.card}>
			<Ionicons name="navigate-circle-outline" size={30} color="#FF7A00" style={styles.icon}/>
			{cargandoOrigen ? (
				<View style={styles.loadingContainer}>
				<ActivityIndicator size="small" color="#FF7A00" />
				<Text style={styles.cardText}>{ubicacionActual}</Text>
				</View>
			) : (
				<Text style={styles.cardText}>{ubicacionActual}</Text>
			)}
			</View>

			<Text style={styles.sectionTitle}>¿A dónde vas? (Destino)</Text>
			<View style={styles.inputContainer}>
			<Ionicons name="pin-outline" size={24} color="#007AFF" />
			<TextInput
			style={styles.input}
			placeholder="Ej: Plaza Bolívar, Caracas"
			value={destinoInput}
			onChangeText={setDestinoInput}
			/>
			<TouchableOpacity 
			style={styles.searchButton}
			onPress={buscarUbicacionDestino}
			disabled={cargandoDestino}
			>
			{cargandoDestino ? (
				<ActivityIndicator size="small" color="#FFF" />
			) : (
				<Ionicons name="search" size={20} color="#FFF" />
			)}
			</TouchableOpacity>
			</View>

			{destinoResultado && (
				<View style={styles.resultCard}>
				<Text style={styles.resultTitle}>Destino Encontrado:</Text>
				<Text style={styles.resultText}>{destinoResultado.address}</Text>
				<Text style={styles.resultCoordinates}>
				Lat: {destinoResultado.latitude.toFixed(6)}, Lon: {destinoResultado.longitude.toFixed(6)}
				</Text>
				</View>
			)}

			<Link href="/pages/TrackerScreen" asChild>
			<TouchableOpacity style={styles.trackingButton}>
			<Ionicons name="bus-outline" size={20} color="#FFF" />
			<Text style={styles.trackingButtonText}>INICIAR MODO CONDUCTOR</Text>
			</TouchableOpacity>
			</Link>

			</View>
		);
}

// === ESTILOS ===
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			padding: 20,
			backgroundColor: '#f5f5f5',
			paddingTop: 50,
		},
		headerText: {
			fontSize: 26,
			fontWeight: '300',
			textAlign: 'center',
			marginBottom: 5,
			color: '#333',
		},
		busTrackerText: {
			fontWeight: '700',
			color: '#007AFF',
		},
		sloganText: {
			fontSize: 16,
			textAlign: 'center',
			color: '#555',
			marginBottom: 30,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: '600',
			marginTop: 20,
			marginBottom: 10,
			color: '#333',
		},
		card: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: 15,
			backgroundColor: '#FFF8E1',
			borderRadius: 10,
			elevation: 2,
		},
		icon: {
			marginRight: 10,
		},
		cardText: {
			flex: 1,
			fontSize: 16,
			fontWeight: '500',
			color: '#333',
		},
		loadingContainer: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		inputContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: '#fff',
			borderRadius: 10,
			paddingHorizontal: 15,
			marginBottom: 10,
			elevation: 2,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 1,
		},
		input: {
			flex: 1,
			height: 50,
			marginLeft: 10,
			fontSize: 16,
		},
		searchButton: {
			backgroundColor: '#007AFF',
			padding: 8,
			borderRadius: 5,
			marginLeft: 10,
		},
		resultCard: {
			padding: 15,
			backgroundColor: '#E3F2FD',
			borderRadius: 10,
			marginTop: 10,
			borderLeftWidth: 5,
			borderLeftColor: '#007AFF',
		},
		resultTitle: {
			fontSize: 16,
			fontWeight: 'bold',
			color: '#007AFF',
			marginBottom: 5,
		},
		resultText: {
			fontSize: 16,
			color: '#333',
		},
		resultCoordinates: {
			fontSize: 14,
			color: '#666',
			marginTop: 5,
		},
		trackingButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#FF3B30',
			paddingVertical: 15,
			paddingHorizontal: 20,
			borderRadius: 10,
			marginTop: 20,
			elevation: 3,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.2,
			shadowRadius: 2,
		},
		trackingButtonText: {
			color: 'white',
			fontSize: 16,
			fontWeight: 'bold',
			marginLeft: 10,
		}
	});
