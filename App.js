import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  ImageBackground, 
} from 'react-native';

// --- COLORES PRINCIPALES DEL PROYECTO SUBA ---
// tal vez deba cambiar los colores a lo nuevo
const COLORS = {
  primaryBlue: '#102957',     // Azul Oscuro (SUBA)
  secondaryYellow: '#FFCD00', // Amarillo (SUBA)
  dangerRed: '#DA291C',       // Rojo (SUBA)
  successGreen: '#4CAF50',    // Verde para estado Activo
  neutralGray: '#9E9E9E',     // Gris para estado Inactivo
  white: '#FFFFFF',
  darkText: '#333333',
  lightOverlay: 'rgba(255, 255, 255, 0.95)', // Fondo para el selector desplegable
};


const BACKGROUND_IMAGE_SOURCE = require('./assets/fondo_suba.png'); 


// Componente principal para la vista del conductor
const DriverDashboardScreen = () => {
  // Estado principal del conductor (Activo, Inactivo, Accidentado)
  const [driverStatus, setDriverStatus] = useState('Activo'); 
  // Estado para controlar la visibilidad del menú de cambio de estado
  const [isStatusSelectorVisible, setIsStatusSelectorVisible] = useState(false); 
  
  // Función para determinar el color del botón de estado
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Activo':
        return styles.statusButtonActive;
      case 'Inactivo':
        return styles.statusButtonInactive;
      case 'Accidentado':
        return styles.statusButtonAccident;
      default:
        return styles.statusButtonInactive;
    }
  };

  // Función que maneja la selección de un nuevo estado
  const handleStatusChange = (newStatus) => {
    setDriverStatus(newStatus);
    setIsStatusSelectorVisible(false); // Ocultar el selector después de la selección
  };


  // Componente que renderiza las opciones de estado desplegables
  const StatusSelector = () => (
    <View style={styles.statusSelectorDropdown}>
      <Text style={styles.dropdownTitle}>Seleccionar Estado:</Text>
      
      {['Activo', 'Inactivo', 'Accidentado'].map((status) => (
        <TouchableOpacity 
          key={status}
          style={[
            styles.dropdownOption, 
            status === driverStatus && styles.dropdownOptionSelected
          ]}
          onPress={() => handleStatusChange(status)}
        >
          <Text style={styles.dropdownText}>{status}</Text>
        </TouchableOpacity>
      ))}
      {/* Botón para cerrar el selector sin cambiar el estado */}
      <TouchableOpacity 
        style={styles.dropdownClose}
        onPress={() => setIsStatusSelectorVisible(false)}
      >
        <Text style={styles.dropdownCloseText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryBlue} />

      {/* --- Contenedor de Imagen de Fondo --- */}
      <ImageBackground 
        source={BACKGROUND_IMAGE_SOURCE} 
        style={styles.backgroundImage}
        resizeMode="cover" 
      >
        {/* --- ENCABEZADO (Header) con Botón de Retroceso --- */}
        <View style={styles.header}>
            {/* Botón de Retroceso (Reemplaza el saludo) */}
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}>⬅️</Text>
            </TouchableOpacity>

            {/* Botón de estado actual que ahora ACTIVA el selector */}
            <TouchableOpacity 
              style={[styles.statusButton, getStatusStyle(driverStatus)]}
              onPress={() => setIsStatusSelectorVisible(true)} // Activa la visibilidad
            >
              <Text style={styles.statusButtonText}>{driverStatus.toUpperCase()}</Text>
            </TouchableOpacity>
        </View>

        {/* --- 1. VISUALIZACIÓN DE LA BILLETERA 💳 (POSICIÓN ORIGINAL) --- */}
        <View style={styles.walletCard}>
          <Text style={styles.walletIcon}>💰</Text> 
          <View>
            <Text style={styles.walletTitle}>Saldo Disponible</Text>
            <Text style={styles.walletBalance}>$4,520.50</Text>
          </View>
          <TouchableOpacity style={styles.rechargeButton}>
            <Text style={styles.rechargeButtonText}>Recargar</Text>
          </TouchableOpacity>
        </View>

        {/* --- 2. UBICACIÓN ACTUAL / MAPA (Placeholder) 📍 (POSICIÓN ORIGINAL) --- */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>[MAPA / GPS]</Text>
          <View style={styles.locationPin}>
              <Text style={styles.locationText}>📍 Ubicación Actual: Av. Atlántico, Puerto Ordaz</Text>
          </View>
        </View>

        {/* --- CONTENIDO PRINCIPAL (El resto del espacio se va al fondo/centro) --- */}
        <View style={styles.contentWrapper}>
            {/* El flex:1 aquí empuja el contenido hacia el centro/abajo */}
        </View>


        {/* --- SELECTOR DE ESTADO DESPLEGABLE (Modal/Overlay) --- */}
        {isStatusSelectorVisible && <StatusSelector />}

      </ImageBackground>
    </SafeAreaView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: COLORS.white,
  },
  
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  
  contentWrapper: {
      flex: 1, // Permite que el fondo ocupe el espacio restante
  },
  
  // --- Encabezado y Barra Superior ---
  header: {
    backgroundColor: COLORS.primaryBlue,
    padding: 15, // Ajuste para que se vea más como una barra de navegación
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
  },
  backButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.white,
  },

  // --- Botón Principal de Estado (Actual) ---
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100, // Asegura que el botón se vea bien con cualquier estado
    alignItems: 'center',
  },
  statusButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusButtonActive: {
    backgroundColor: COLORS.successGreen,
  },
  statusButtonInactive: {
    backgroundColor: COLORS.neutralGray,
  },
  statusButtonAccident: {
    backgroundColor: COLORS.dangerRed,
  },

  // --- 1. Tarjeta de Billetera (Wallet) ---
  walletCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20, // Ajuste de margen superior para separarlo del header
    marginBottom: 10, // Menos margen que antes para acercarlo al mapa
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  walletIcon: {
    fontSize: 30,
    color: COLORS.primaryBlue,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: COLORS.secondaryYellow + '30', 
    borderRadius: 8,
    marginRight: 15,
  },
  walletTitle: {
    fontSize: 14,
    color: COLORS.darkText,
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  rechargeButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rechargeButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // --- 2. Placeholder de Ubicación / Mapa ---
  mapPlaceholder: {
    height: 300, // Aumentado el alto para darle más visibilidad al mapa
    backgroundColor: '#E0E0E0', 
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  mapText: {
    color: COLORS.neutralGray,
    fontSize: 24,
    fontWeight: '300',
  },
  locationPin: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 10,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.darkText,
    fontWeight: '600',
    textAlign: 'center',
  },

  // --- 3. Selector de Estado Desplegable (Overlay) ---
  statusSelectorDropdown: {
    position: 'absolute',
    top: 60, // Debajo de la barra de estado
    right: 15, // Alineado con el botón de estado
    backgroundColor: COLORS.lightOverlay, 
    borderRadius: 10,
    padding: 10,
    zIndex: 100, // Asegura que esté por encima de todo
    width: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownOptionSelected: {
    backgroundColor: COLORS.secondaryYellow + '30',
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.darkText,
    fontWeight: '500',
  },
  dropdownClose: {
      marginTop: 10,
      paddingVertical: 8,
      alignItems: 'center',
      backgroundColor: '#EEEEEE',
      borderRadius: 5,
  },
  dropdownCloseText: {
      color: COLORS.dangerRed,
      fontWeight: '600',
  }
});

export default DriverDashboardScreen;