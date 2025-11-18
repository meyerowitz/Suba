import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bus Tracker CiudBolivar</Text>
      
      <View style={styles.buttonContainer}>
        <Link href="/pages/MapScreen" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Ver Mapa de Buses</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/pages/TrackerScreen" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Enviar Ubicación (Tracker)</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});