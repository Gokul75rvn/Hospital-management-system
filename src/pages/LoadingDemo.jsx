import React, { useState, useEffect } from 'react'
import LoadingScreen from '../components/LoadingScreen'
import { useNavigate } from 'react-router-dom'

export default function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate loading for 5 seconds, then redirect
    const timer = setTimeout(() => {
      setIsLoading(false)
      // You can navigate to any page after loading
      // navigate('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6F1FA] to-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Loading Complete!
        </h1>
        <p className="text-gray-600 mb-8">Welcome to MediSync Dashboard</p>
        <button
          onClick={() => setIsLoading(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          Replay Loading Animation
        </button>
      </div>
    </div>
  )
}
