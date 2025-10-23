import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail, Lock, LogIn, Loader2, Shield, Stethoscope, Users, Heart, ArrowLeft, AlertTriangle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const { signIn, profile, user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const preSelectedRole = location.state?.role

  const roles = [
    {
      title: 'Admin',
      role: 'admin',
      icon: Shield,
      description: 'System Administrator',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Doctor',
      role: 'doctor',
      icon: Stethoscope,
      description: 'Medical Professional',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Staff',
      role: 'staff',
      icon: Users,
      description: 'Hospital Staff',
      color: 'from-orange-500 to-amber-600',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Patient',
      role: 'patient',
      icon: Heart,
      description: 'Patient Portal',
      color: 'from-teal-500 to-cyan-600',
      borderColor: 'border-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20'
    }
  ]

  useEffect(() => {
    // Pre-select role if passed from landing page
    if (preSelectedRole) {
      setSelectedRole(preSelectedRole)
    }
  }, [preSelectedRole])

  useEffect(() => {
    // Redirect if already logged in
    if (user && profile && !loading) {
      redirectBasedOnRole(profile.role)
    }
  }, [user, profile, loading])

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard')
        break
      case 'doctor':
        navigate('/doctor/dashboard')
        break
      case 'staff':
        navigate('/staff/dashboard')
        break
      case 'patient':
        navigate('/patient/dashboard')
        break
      default:
        navigate('/')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await signIn({ email, password })
    
    if (!result?.error && result?.data) {
      // Profile will be loaded by AuthContext, wait briefly then redirect
      setTimeout(() => {
        // UseEffect will handle the redirect once profile loads
      }, 100)
    }
    
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // If no role selected, show role selection cards
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 transition-colors">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {/* Demo Mode Alert */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-2xl shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-yellow-400 dark:bg-yellow-600 rounded-full">
                  <AlertTriangle className="w-7 h-7 text-yellow-900 dark:text-yellow-100" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                  🎭 Demo Mode Active
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200 mb-3 leading-relaxed">
                  Authentication is currently disabled. Click any role below to access the dashboard directly <strong>without entering credentials</strong>.
                </p>
                <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-800/30 px-4 py-2 rounded-lg">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">No login required • Full access to all features</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4"
            >
              <LogIn className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Select your role to continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role, index) => {
              const Icon = role.icon
              return (
                <motion.button
                  key={role.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    // In demo mode, directly navigate to dashboard
                    redirectBasedOnRole(role.role)
                  }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-opacity-100 hover:scale-105"
                  style={{ borderColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = role.borderColor.replace('border-', '')}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${role.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{role.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{role.description}</p>
                  <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold mb-3">
                    <Shield className="w-3.5 h-3.5" />
                    Direct Access
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    Enter as {role.title}
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Show login form for selected role
  const selectedRoleData = roles.find(r => r.role === selectedRole)
  const RoleIcon = selectedRoleData?.icon || LogIn

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <button
          onClick={() => setSelectedRole(null)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Change Role
        </button>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`inline-block p-3 rounded-full mb-4 bg-gradient-to-br ${selectedRoleData?.color || 'from-blue-500 to-indigo-600'}`}
          >
            <RoleIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {selectedRoleData?.title} Login
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {selectedRoleData?.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
