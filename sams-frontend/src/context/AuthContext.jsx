import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const USER_KEY = 'sams_user'
const TOKEN_KEY = 'sams_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_KEY)
      const t = localStorage.getItem(TOKEN_KEY)
      if (u) setUser(JSON.parse(u))
      if (t) setToken(t)
    } catch {}
    setLoading(false)
  }, [])

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    localStorage.setItem(TOKEN_KEY, jwt)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  const updateUser = (patch) => {
    const next = { ...user, ...patch }
    setUser(next)
    localStorage.setItem(USER_KEY, JSON.stringify(next))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
