import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"

WebBrowser.maybeCompleteAuthSession()

// IMPORTANTE: Reemplaza con tu Google Client ID
const GOOGLE_CLIENT_ID = "TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: true,
})

export const googleAuth = async () => {
  try {
    const discovery = await AuthSession.DiscoveryDocument.fetchAsync("https://accounts.google.com")

    if (!discovery) {
      throw new Error("Discovery document not found")
    }

    const result = await AuthSession.startAsync({
      authUrl: discovery.authorizationEndpoint,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: undefined,
      redirectUrl: GOOGLE_REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
    })

    if (result.type !== "success") {
      return { success: false, error: "Autenticación cancelada" }
    }

    // Aquí intercambias el código por token con tu backend
    const { access_token } = result.params

    return {
      success: true,
      googleToken: access_token,
      // Tu backend debería procesar esto y devolver tu JWT
    }
  } catch (error) {
    console.error("[GoogleAuth]", error)
    return { success: false, error: error.message }
  }
}