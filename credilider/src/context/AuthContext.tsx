'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  isAuthenticated: false,
  login: async (email: string, password: string) => {},
  logout: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const login = async (email: string, password: string) => {
    // Aquí hacer la llamada a tu API de autenticación
    // Por ejemplo:
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await response.json();
    // const token = data.token;
    
    // Por ahora, simulamos un token
    const token = "dummy-token";
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
