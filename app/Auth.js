"use client"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { useAuth } from "./context/AuthContext"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login, register, error, clearError } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error)
      clearError()
    }
  }, [error])

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (!isLogin && !nombre.trim()) {
      Alert.alert("Error", "Por favor ingresa tu nombre")
      return
    }

    setLoading(true)

    try {
      let result
      if (isLogin) {
        result = await login(email, password)
      } else {
        result = await register(email, password, nombre)
      }

      if (result.success) {
        router.replace("/ChoseaRol")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      Alert.alert(
        "Google Login",
        "Esta función se implementará una vez que configures tu Google Cloud Project. Por ahora, usa email y contraseña.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="bus" size={50} color="#FF6B35" />
            <Text style={styles.title}>Suba</Text>
            <Text style={styles.subtitle}>{isLogin ? "Inicia sesión" : "Crea tu cuenta"}</Text>
          </View>

          <View style={styles.formContainer}>
            {!isLogin && (
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre completo"
                  value={nombre}
                  onChangeText={setNombre}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>{isLogin ? "Iniciar sesión" : "Registrarse"}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, loading && styles.submitButtonDisabled]}
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <MaterialCommunityIcons name="google" size={20} color="#1F2937" />
              <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => {
                setIsLogin(!isLogin)
                setEmail("")
                setPassword("")
                setNombre("")
                clearError()
              }}
              disabled={loading}
            >
              <Text style={styles.toggleButtonText}>
                {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                <Text style={styles.toggleButtonHighlight}>{isLogin ? "Regístrate" : "Inicia sesión"}</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Al continuar, aceptas nuestros términos y políticas</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    backgroundColor: "#F9F9F9",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  eyeButton: {
    padding: 8,
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  dividerText: {
    paddingHorizontal: 12,
    color: "#999",
    fontSize: 14,
  },
  toggleButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#666",
  },
  toggleButtonHighlight: {
    color: "#FF6B35",
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 12,
  },
  googleButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
}