import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View , ActivityIndicator, Alert,Text, Platform, TextInput, TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as Location from 'expo-location';

// ..####....####...##...##..#####....####...##..##..######..##..##..######.
// .##..##..##..##..###.###..##..##..##..##..###.##..##......###.##....##...
// .##......##..##..##.#.##..#####...##..##..##.###..####....##.###....##...
// .##..##..##..##..##...##..##......##..##..##..##..##......##..##....##...
// ..####....####...##...##..##.......####...##..##..######..##..##....##...
// .........................................................................
// .##...##..######..#####...##...##...####...#####..                       
// .##...##..##......##..##..###.###..##..##..##..##.                       
// .##.#.##..####....#####...##.#.##..######..#####..                       
// .#######..##......##..##..##...##..##..##..##.....                       
// ..##.##...######..#####...##...##..##..##..##.....                       
// .................................................. 

// BBOX estático para Ciudad Guayana: [LatSur, LonOeste, LatNorte, LonEste]
const GUAYANA_BBOX = "8.21,-62.88,8.39,-62.60";

//---------------------Funcion que renderiza el mapa------------------------
const loadMapHtml = async () => {
  const asset = Asset.fromModule(require('../../assets/map.html'));
  await asset.downloadAsync();
  return asset.uri;
};
//-----------------------------------------------------------------------
// -------------------------------------------------------------
// FUNCIÓN DE CONSULTA A OVERPASS
// -------------------------------------------------------------
const fetchGuayanaBusStops = async () => {
    // La consulta se mantiene, solo se reescribe para claridad
    const overpassQuery = `
        [out:json][timeout:30];
        node[highway=bus_stop](${GUAYANA_BBOX});
        out center; 
    `;
    const encodedQuery = encodeURIComponent(overpassQuery);
    const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json(); 
    } catch (error) {
        console.error("Error al obtener paradas de Overpass:", error);
        return null;
    }
};
//--------------------------------------------------------

export default function WebView2 ()  {
    //---------------Hooks------------------------------
    const webviewRef = useRef(null);//---cluster del mapa
    const [mapHtmlUri, setMapHtmlUri] = useState(null);//---url y datos del mapa del tiempo real
    const [loading, setLoading] = useState(true);

    const [userLocation, setUserLocation] = useState(null);//--ubicacion del usuario en tiempo real

    const [searchQuery, setSearchQuery] = useState('')//----Query de busquedas
    const [searchResult, setSearchResult] = useState(null);//----Resultados de la busqueda
    const [isSearching, setIsSearching] = useState(false);//---Stado de la busqueda
    //--------------------------------------------------

//-----------UseEffet loadhtmlUri-----------------------
  useEffect(() => {
    loadMapHtml().then(setMapHtmlUri);
  }, []);
 // --- Lógica de Expo Location ---
  useEffect(() => {
        let locationSubscription = null;
        const requestPermissionsAndGetLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "Permiso denegado",
                    "Necesitamos permiso para acceder a la ubicación y mostrar tu posición en el mapa."
                );
                setLoading(false);
                return;
            }
            locationSubscription = await Location.watchPositionAsync(
                {
                   accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 360000, // Actualiza cada 6 minutos
                    distanceInterval: 10, // Actualiza cada 10 metros
                },
                (location) => {
                    const { latitude, longitude } = location.coords;
                  setUserLocation({ latitude, longitude });
                  setLoading(false);
                }
            );
        };
        requestPermissionsAndGetLocation();
        // Limpieza: detener la suscripción cuando el componente se desmonte
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

//-----------------UseEffect para actualizar el marcador--------------------
useEffect(() => {
    // Solo inyecta el JS si la ubicación del usuario y la referencia del webview existen
    if (userLocation && webviewRef.current) {
        const { latitude, longitude } = userLocation;
        
        // Crea el código JavaScript para llamar a la función en el mapa
        const jsCode = `updateUserMarker(${latitude}, ${longitude}); true;`;
        
        // Inyecta el JS
        webviewRef.current.injectJavaScript(jsCode);

        // Opcional: Centrar la vista del mapa en la ubicación del usuario si lo deseas
        // const centerJs = `map.setView([${latitude}, ${longitude}], map.getZoom()); true;`;
        // webviewRef.current.injectJavaScript(centerJs);
    }
}, [userLocation, webviewRef]); // Depende de userLocation para actualizarse
//----------------------------------------------->

   // en el caso de que maphtmlUri se encuentre vacio se graficara una pantalla de carga
  if (!mapHtmlUri) {
        return (
               <View style={[styles.container, styles.center]}>
                   <ActivityIndicator size="large" color="#007bff" />
                   <Text style={styles.loadingText}>Buscando tu ubicación...</Text>
               </View>
           );
   
  }
  
      // --- Renderizado ---
  
      if (loading) {
          return (
              <View style={[styles.container, styles.center]}>
                  <ActivityIndicator size="large" color="#007bff" />
                  <Text style={styles.loadingText}>Buscando tu ubicación...</Text>
              </View>
          );
  
      }
  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row', marginBottom: 10,padding: 5,backgroundColor: '#fff',borderRadius: 8,elevation: 2,shadowColor: '#000', shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.1, shadowRadius: 3,}}>
            <TextInput style={{flex: 1,height: 40,paddingHorizontal: 10,fontSize: 16,color: '#333',}} 
                placeholder="Ej: Plaza Bolívar, Caracas" 
                value={searchQuery} 
                onChangeText={setSearchQuery}
                onSubmitEditing={()=>{}} // Permite buscar al presionar "Enter"
                editable={!isSearching}/>
            <TouchableOpacity
                style={{backgroundColor: '#007bff',borderRadius: 5,paddingHorizontal: 15,paddingVertical: 8,justifyContent: 'center',alignItems: 'center', marginLeft: 8,minWidth: 70,}}
                onPress={()=>{}}
                disabled={isSearching} >
        
                {isSearching ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={{color: '#fff',fontWeight: 'bold', fontSize: 16,}}>
                        Buscar
                    </Text>
                )}
                    </TouchableOpacity>
        
        </View>

        <View style={{flex: 1, borderRadius: 12,overflow: 'hidden',shadowColor: '#000',shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.1,shadowRadius: 5,elevation: 8,}}>
             <WebView
                ref={webviewRef}
                source={{ uri: mapHtmlUri }}
                style={{flex: 1,}}
                onMessage={()=>{}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scrollEnabled={false}
                
            />
        </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 10,
  },
  webview: {
    flex: 1,
  },
  center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },

});
