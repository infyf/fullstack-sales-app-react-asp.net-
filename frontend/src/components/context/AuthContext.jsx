
import { createContext, useContext, useState, useEffect, useCallback } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const API_URL = "https://localhost:7191/api/auth"
  const PROFILE_API_URL = "https://localhost:7191/api/Profile"

  const updateCurrentUser = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const fetchProfile = useCallback(async (email) => {
    try {
      const profileResponse = await fetch(`${PROFILE_API_URL}/GetProfile?email=${email}`)
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        const updatedUser = {
          email,
          firstName: profileData?.profile?.firstName,
          lastName: profileData?.profile?.lastName,
          user_id: profileData?.profile?.userId,
          displayName: profileData?.profile?.name,
        }
        updateCurrentUser(updatedUser)
        setAuthError(null)
      } else {
        console.error("Помилка при отриманні профілю")
        const errorData = await profileResponse.json()
        setAuthError(errorData?.message || "Не вдалося отримати профіль.")
      }
    } catch (error) {
      console.error("Помилка при отриманні профілю:", error)
      setAuthError("Виникла помилка при отриманні профілю.")
    }
  }, [])

  useEffect(() => {
    const loadUserAndProfile = async () => {
      if (currentUser?.email) {
        await fetchProfile(currentUser.email)
      }
      setLoading(false)
    }

    loadUserAndProfile()
  }, [currentUser?.email, fetchProfile])

  const register = async (email, password, name) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setAuthError(errorData.message || "Помилка реєстрації")
        throw new Error(errorData.message || "Помилка реєстрації")
      }

      const data = await response.json()
      const newUser = {
        user_id: data.user.id,
        email: data.user.email,
        displayName: data.user.name,
      }
      updateCurrentUser(newUser)
      await fetchProfile(email)
      setAuthError(null)
      return newUser
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setAuthError(errorData.message || "Помилка входу")
        throw new Error(errorData.message || "Помилка входу")
      }

      const data = await response.json()
      const loggedInUser = {
        user_id: data.user.id,
        email: data.user.email,
        displayName: data.user.name,
      }
      updateCurrentUser(loggedInUser)
      await fetchProfile(email)
      setAuthError(null)
      return loggedInUser
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
    setAuthError(null)
    return Promise.resolve()
  }

  const updateProfile = async (userData) => {
    try {
      // Convert property names to match what the backend expects
      const apiData = {
        FirstName: userData.firstName,
        LastName: userData.lastName,
        Phone: userData.phone,
        Address: userData.address,
        AvatarUrl: userData.avatarUrl,
      }

      console.log("Sending profile update with data:", apiData)

      const response = await fetch(`${PROFILE_API_URL}/UpdateProfile?email=${currentUser.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Profile update successful:", result)
        await fetchProfile(currentUser.email)
        setAuthError(null)
        return result
      } else {
        console.error("Помилка при оновленні профілю на сервері")
        const errorData = await response.json()
        setAuthError(errorData?.message || "Не вдалося оновити профіль.")
        throw new Error(errorData?.message || "Не вдалося оновити профіль.")
      }
    } catch (error) {
      console.error("Помилка при оновленні профілю:", error)
      setAuthError("Виникла помилка при оновленні профілю.")
      throw error
    }
  }

  const value = {
    currentUser,
    loading,
    authError,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    user: currentUser,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export default AuthProvider
