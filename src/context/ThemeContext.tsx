// src/context/ThemeContext.tsx
import {
    createContext, useContext, useEffect, useState, type ReactNode,
  } from 'react'
  
  interface ThemeContextValue {
    dark: boolean
    toggleDark: () => void
  }
  
