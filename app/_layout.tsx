"use client"

import { Stack } from "expo-router"
import { ActivityIndicator, View } from "react-native"
import { AuthProvider, useAuth } from "./context/AuthContext"

function RootLayoutContent() {
  const { isLoading, token } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    )
  }

  if (!token) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" options={{}} />
      </Stack>
    )
  }

  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  )
}
