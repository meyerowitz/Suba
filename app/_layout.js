import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="pages/MapScreen" options={{ title: 'Seguimiento de Buses' }} />
        <Stack.Screen name="pages/TrackerScreen" options={{ title: 'Enviar Ubicación' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}