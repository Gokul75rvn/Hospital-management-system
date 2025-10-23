import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingPage from '../pages/LoadingPage'

/**
 * LoadingWrapper - Wraps your app with a beautiful loading screen
 * 
 * Usage:
 * <LoadingWrapper minLoadingTime={2000}>
 *   <YourApp />
 * </LoadingWrapper>
 */
export default function LoadingWrapper({ children, minLoadingTime = 3000 }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ensure minimum loading time for smooth animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, minLoadingTime)

    return () => clearTimeout(timer)
  }, [minLoadingTime])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)'
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <LoadingPage />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ 
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)'
          }}
          animate={{ 
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)'
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
