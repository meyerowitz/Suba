"use client"

import { useRootNavigationState, useRouter } from "expo-router"
import { useEffect } from "react"
import { useAuth } from "./context/AuthContext"

export default function Index() {
  const { token } = useAuth()
  const router = useRouter()
  const navigationState = useRootNavigationState()

  useEffect(() => {
    if (!navigationState?.key) return // Esperar a que se renderice

    if (token) {
      // Ir a ChooseRol si hay token
      router.replace("/ChoseaRol")
    } else {
      // Ir a auth si no hay token
      router.replace("/Auth")
    }
  }, [token, navigationState?.key])

  return null
}