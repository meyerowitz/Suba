const API_URL = "https://api-bus-w29v.onrender.com/api/v1"

export const authService = {
  // Registro de nuevo usuario
  async register(email, password, nombre) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nombre }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error en registro")
      }

      const { token, user } = await response.json()
      return { token, user }
    } catch (error) {
      console.error("[AuthService] Register error:", error)
      throw error
    }
  },

  // Login
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error en login")
      }

      const { token, user } = await response.json()
      return { token, user }
    } catch (error) {
      console.error("[AuthService] Login error:", error)
      throw error
    }
  },

  // Obtener usuario actual con token
  async getCurrentUser(token) {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("No autorizado")

      const user = await response.json()
      return user
    } catch (error) {
      console.error("[AuthService] Get user error:", error)
      throw error
    }
  },

  // Logout (normalmente solo limpiar token localmente)
  async logout() {
    // La mayoría de las apps solo limpian el token localmente
    // Opcional: notificar al backend si es necesario
    return true
  },
}