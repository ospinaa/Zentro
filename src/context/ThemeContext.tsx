/* eslint-disable react-refresh/only-export-components */
// src/context/ThemeContext.tsx
import {
    createContext, useContext, useEffect, useState, type ReactNode,
  } from 'react'
  
  interface ThemeContextValue {
    dark: boolean
    toggleDark: () => void
  }
  
  const ThemeContext = createContext<ThemeContextValue | null>(null)
  
  export function ThemeProvider({ children }: { children: ReactNode }) {
    const [dark, setDark] = useState<boolean>(() => {
      try { return localStorage.getItem('zentro_dark') === 'true' }
      catch { return false }
    })
  
    useEffect(() => {
      document.documentElement.classList.toggle('dark', dark)
      localStorage.setItem('zentro_dark', String(dark))
    }, [dark])
  
    return (
      <ThemeContext.Provider value={{ dark, toggleDark: () => setDark(d => !d) }}>
        {children}
      </ThemeContext.Provider>
    )
  }
  
  export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider')
    return ctx
  }