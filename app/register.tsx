import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function Register() {
  const router = useRouter();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');


  const handleLogin = async () => {
    if(!mail || !password || !fullName) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    try {
      /*const response = await fetch(`DIRECCION DEL SERVIDOR`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail,fullName, password }),
      });

      const data = await response.json();*/     //habilitar cuando el back este listo
      
        if (true) {//reemplazar por data.success cuando el back este listo revisar heilper para ver configuaracion del contexto
        //setCorreoUsuario(data.mail); activar cuando el back este listo
        router.replace('/(tabs)'); // Redirigir al home
      } else {
        Alert.alert('Error', "data.message");
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error de red');
    }
  };

  return   (  
  <View style={styles.page}>
      <View style={styles.container}>

          <View style={styles.logo}>
            <Image source={require('@/assets/images/logo.png')} style={styles.wordmark}/>
          </View>

          <Text style={styles.title}>
            ¡Registrate!                         
          </Text>

          <TextInput placeholder="Nombre Completo" value={fullName} onChangeText={setFullName} style={styles.input} />
          <TextInput placeholder="Correo electrónico" value={mail} onChangeText={setMail} style={styles.input} />
          <TextInput textContentType='password' placeholder="Introduce tu contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          
          <Text style={styles.question}>O registrate con redes sociales </Text>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.textButton}>CREAR CUENTA</Text>
          </TouchableOpacity>

          <View style={styles.smContainer}>
            <TouchableOpacity style={styles.smButton}>
              <Image source={require('@/assets/images/google.png')} style={styles.google}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smButton}>
              <Image source={require('@/assets/images/facebook.png')} style={styles.facebook}/>
            </TouchableOpacity>
          </View>

          <View style={styles.redirect}>
            <Text style={styles.question}>Ya tienes cuenta? </Text>
            <TouchableOpacity  onPress={() => router.push('/login')}>
                <Text style={styles.register}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>

      </View>
  </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFFFFF',
  },
  container: {
    height: '100%',
    width: '100%',
    justifyContent:'center',
    alignItems:'center',
  },
  logo:{
    alignItems:'center',
    justifyContent:'center',
    width:320,
    height:88.28,
    marginTop:50,
    marginBottom:40,
  },
  wordmark:{
    width:320,
    height:88.28,
  },
  title:{
    fontSize:30,
    fontFamily:'roboto',
    fontWeight:'bold',
    color:'#212121',
    marginBottom:30,
  },
  input:{
    width:320,
    height:60,
    padding:10,
    borderWidth:1,
    borderColor:'#DFDFDF',
    borderRadius:100,
    fontFamily:'roboto',
    fontSize:18,
    marginBottom:20,
  },
  question:{
    color:'#544F4F',
    fontFamily:'roboto',
    fontWeight:'bold',
    fontSize:16,
  },
  button:{
    display:'flex',
    marginTop:20,
    width:320,
    height:60,
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FFA311',
  },
    textButton:{
    color:'#023A73',
    fontSize:18,
    fontWeight:'bold',
    fontFamily:'roboto',
  },
  smContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    gap:20,
  },
  smButton:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    width:48,
    height:48,
    borderRadius:100,
    borderWidth:2,
    borderColor:'#F3F3F3',
    backgroundColor:"#FFFFFF",
    shadowColor: '#000',
    shadowOffset: {
      width: 0, 
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  google:{
    width:24,
    height:24
  },
  facebook:{
    width:13,
    height:24
  },
  redirect:{
    width:320,
    marginTop:20,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  register:{
    color: '#0661BC',
    fontFamily:'roboto',
    fontWeight:'bold',
    fontSize:16,
    textDecorationLine: 'underline',
  },
});
