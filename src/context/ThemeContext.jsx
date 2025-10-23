import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Load theme from localStorage
    const saved = localStorage.getItem('hms-theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev
      if (newValue) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('hms-theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('hms-theme', 'light')
      }
      return newValue
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
