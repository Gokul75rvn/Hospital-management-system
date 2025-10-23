import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom'
import { Sun, Moon, LogOut, User, Activity, Home } from 'lucide-react'

export default function Navbar({ demoRole = null }) {
  const { profile, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  
  // Use demo role if no profile exists
  const currentProfile = profile || (demoRole ? {
    name: `Demo ${demoRole.charAt(0).toUpperCase() + demoRole.slice(1)}`,
    role: demoRole
  } : null)
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'doctor':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'staff':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'patient':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="MediSync Logo" className="w-10 h-10" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">MediSync</span>
          </Link>

          <div className="flex items-center gap-4">
            {currentProfile && (
              <div className="flex items-center gap-3">
                {/* Home Button */}
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-sm font-medium transition-all shadow-md hover:shadow-lg"
                  title="Back to Home"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>

                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {currentProfile.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full inline-block w-fit ${getRoleColor(currentProfile.role)}`}>
                      {currentProfile.role?.charAt(0).toUpperCase() + currentProfile.role?.slice(1)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? 
                    <Sun className="w-5 h-5 text-yellow-400" /> : 
                    <Moon className="w-5 h-5 text-gray-600" />
                  }
                </button>

                <button 
                  onClick={() => signOut()} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
