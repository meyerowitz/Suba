"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useEffect, useState } from "react"
import { authService } from "../services/authService"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar token guardado al iniciar
  useEffect(() => {
    bootstrapAsync()
  }, [])

  const bootstrapAsync = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("authToken")
      if (savedToken) {
        const user = await authService.getCurrentUser(savedToken)
        setToken(savedToken)
        setUser(user)
      }
    } catch (error) {
      console.error("[AuthContext] Bootstrap error:", error)
      // Token inválido, limpiar
      await AsyncStorage.removeItem("authToken")
    } finally {
      setIsLoading(false)
    }
  }

  const authContext = {
    user,
    token,
    isLoading,
    error,

    // Registro
    register: async (email, password, nombre) => {
      try {
        setError(null)
        const { token, user } = await authService.register(email, password, nombre)
        await AsyncStorage.setItem("authToken", token)
        setToken(token)
        setUser(user)
        return { success: true }
      } catch (error) {
        const errorMsg = error.message || "Error en registro"
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    },

    // Login
    login: async (email, password) => {
      try {
        setError(null)
        const { token, user } = await authService.login(email, password)
        await AsyncStorage.setItem("authToken", token)
        setToken(token)
        setUser(user)
        return { success: true }
      } catch (error) {
        const errorMsg = error.message || "Error en login"
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    },

    // Logout
    logout: async () => {
      try {
        await authService.logout()
        await AsyncStorage.removeItem("authToken")
        setToken(null)
        setUser(null)
        setError(null)
      } catch (error) {
        console.error("[AuthContext] Logout error:", error)
      }
    },

    // Limpiar error
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
}

// Hook para usar el contexto
export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe estar dentro de AuthProvider")
  }
  return context
}