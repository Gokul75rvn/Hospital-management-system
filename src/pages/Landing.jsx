import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon, 
  UserCircleIcon, 
  HeartIcon, 
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '../context/ThemeContext'
import { 
  Sun, 
  Moon, 
  Stethoscope, 
  Activity, 
  Users, 
  Calendar,
  Shield,
  Heart,
  FileText,
  TrendingUp
} from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const roles = [
    {
      title: 'Admin',
      role: 'admin',
      icon: Shield,
      heroIcon: UserGroupIcon,
      description: 'Manage hospital operations and oversee staff',
      subtext: 'Full system control and analytics',
      color: 'from-purple-500 to-indigo-600',
      lightColor: 'from-purple-50 to-indigo-50',
      darkColor: 'from-purple-900/20 to-indigo-900/20',
    },
    {
      title: 'Doctor',
      role: 'doctor',
      icon: Stethoscope,
      heroIcon: HeartIcon,
      description: 'Access patient records and schedules',
      subtext: 'Provide quality healthcare',
      color: 'from-red-500 to-pink-600',
      lightColor: 'from-red-50 to-pink-50',
      darkColor: 'from-red-900/20 to-pink-900/20',
    },
    {
      title: 'Staff',
      role: 'staff',
      icon: Users,
      heroIcon: ClipboardDocumentListIcon,
      description: 'Coordinate patient care and support',
      subtext: 'Efficient healthcare delivery',
      color: 'from-orange-500 to-amber-600',
      lightColor: 'from-orange-50 to-amber-50',
      darkColor: 'from-orange-900/20 to-amber-900/20',
    },
    {
      title: 'Patient',
      role: 'patient',
      icon: Heart,
      heroIcon: UserCircleIcon,
      description: 'Book appointments and track health',
      subtext: 'Your health, our priority',
      color: 'from-emerald-500 to-teal-600',
      lightColor: 'from-emerald-50 to-teal-50',
      darkColor: 'from-emerald-900/20 to-teal-900/20',
    }
  ]

  const handleRoleClick = (role) => {
    // Navigate directly to dashboard based on role
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F1FA] via-white to-[#E6F1FA] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Medical Icons */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 opacity-5 dark:opacity-10"
        >
          <Stethoscope className="w-32 h-32 text-blue-500" />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 opacity-5 dark:opacity-10"
        >
          <Activity className="w-40 h-40 text-emerald-500" />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-1/4 opacity-5 dark:opacity-10"
        >
          <Heart className="w-36 h-36 text-red-500" />
        </motion.div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <img src="/logo.png" alt="MediSync Logo" className="w-14 h-14" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  MediSync
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Hospital Management System</p>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex items-center gap-8"
            >
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                Features
              </a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                Contact
              </a>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                {theme === 'dark' ? 
                  <Sun className="w-5 h-5 text-amber-500" /> : 
                  <Moon className="w-5 h-5 text-indigo-600" />
                }
              </button>
              <Link 
                to="/register" 
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-medium"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-8 border border-blue-200/50 dark:border-blue-700/50"
          >
            <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Smart Healthcare Management</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-900 dark:text-white">Empowering</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smarter Healthcare
            </span>
          </h1>
          
          {/* Subtext */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Manage patients, appointments, and staff seamlessly with our comprehensive 
            <span className="font-semibold text-gray-800 dark:text-white"> hospital management platform</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
            >
              Get Started Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
            >
              Watch Demo
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
          </div>
        </motion.div>

        {/* Role Login Cards */}
        <div className="max-w-7xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Portal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Select your role to access your personalized dashboard
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                onClick={() => handleRoleClick(item.role)}
                className="cursor-pointer group"
              >
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 h-full overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-transparent hover:scale-105">
                  {/* Glassmorphism effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.lightColor} dark:${item.darkColor} animate-pulse`} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className="mb-6">
                      <motion.div 
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all`}
                      >
                        <item.icon className="w-10 h-10 text-white" />
                      </motion.div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white text-center">
                      {item.title} Login
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-2 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Subtext */}
                    <p className="text-gray-500 dark:text-gray-500 text-center text-xs mb-6 italic">
                      {item.subtext}
                    </p>

                    {/* Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 bg-gradient-to-r ${item.color} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:gap-3`}
                    >
                      Access Dashboard
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Decorative corner element */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${item.color} rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          id="features"
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full mb-6 border border-emerald-200/50 dark:border-emerald-700/50"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Powerful Features</span>
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive tools designed for modern healthcare management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Appointment Management',
                description: 'Schedule, track, and manage appointments with intelligent reminders and notifications',
                color: 'from-blue-500 to-cyan-600',
                bgColor: 'from-blue-50 to-cyan-50',
                darkBgColor: 'from-blue-900/20 to-cyan-900/20'
              },
              {
                icon: ShieldCheckIcon,
                title: 'Secure & Compliant',
                description: 'HIPAA-compliant data security with role-based access control and encryption',
                color: 'from-purple-500 to-indigo-600',
                bgColor: 'from-purple-50 to-indigo-50',
                darkBgColor: 'from-purple-900/20 to-indigo-900/20'
              },
              {
                icon: Activity,
                title: 'Real-time Analytics',
                description: 'Monitor hospital operations with live dashboards and comprehensive reports',
                color: 'from-emerald-500 to-teal-600',
                bgColor: 'from-emerald-50 to-teal-50',
                darkBgColor: 'from-emerald-900/20 to-teal-900/20'
              },
              {
                icon: Users,
                title: 'Patient Records',
                description: 'Centralized electronic health records accessible to authorized medical staff',
                color: 'from-red-500 to-pink-600',
                bgColor: 'from-red-50 to-pink-50',
                darkBgColor: 'from-red-900/20 to-pink-900/20'
              },
              {
                icon: ClockIcon,
                title: 'Staff Scheduling',
                description: 'Efficient shift management and attendance tracking for all hospital staff',
                color: 'from-orange-500 to-amber-600',
                bgColor: 'from-orange-50 to-amber-50',
                darkBgColor: 'from-orange-900/20 to-amber-900/20'
              },
              {
                icon: ChartBarIcon,
                title: 'Performance Insights',
                description: 'Data-driven insights to improve efficiency and patient care quality',
                color: 'from-violet-500 to-purple-600',
                bgColor: 'from-violet-50 to-purple-50',
                darkBgColor: 'from-violet-900/20 to-purple-900/20'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="group"
              >
                <div className={`relative p-8 bg-gradient-to-br ${feature.bgColor} dark:${feature.darkBgColor} backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 h-full`}>
                  <div className="relative z-10">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About MediSync
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              MediSync is a comprehensive hospital management system designed to streamline healthcare operations, 
              improve patient care, and enhance communication between medical staff and patients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Our Mission',
                description: 'To revolutionize healthcare management through innovative technology, making quality healthcare accessible and efficient for everyone.',
                icon: '🎯'
              },
              {
                title: 'Our Vision',
                description: 'Creating a world where healthcare providers can focus on what matters most - caring for patients - while we handle the rest.',
                icon: '👁️'
              },
              {
                title: 'Our Values',
                description: 'Security, reliability, and user-centric design are at the heart of everything we build and deliver.',
                icon: '💎'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-8 md:p-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Trusted by Healthcare Professionals Worldwide
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
              Join thousands of hospitals and clinics using MediSync to deliver better patient care
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '500+', label: 'Hospitals' },
                { number: '10K+', label: 'Healthcare Staff' },
                { number: '100K+', label: 'Patients' },
                { number: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: '📧', label: 'Email', value: 'support@medisync.com' },
                    { icon: '📞', label: 'Phone', value: '+1 (555) 123-4567' },
                    { icon: '📍', label: 'Address', value: '123 Healthcare Ave, Medical District' },
                    { icon: '🕐', label: 'Hours', value: 'Mon-Fri: 9AM-6PM EST' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{item.label}</div>
                        <div className="text-gray-600 dark:text-gray-400">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3">Need Immediate Support?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  For urgent technical issues or emergencies, our 24/7 support team is available.
                </p>
                <a 
                  href="tel:+15551234567"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  Call Emergency Support
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-24 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="MediSync Logo" className="w-12 h-12" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  MediSync
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Modern hospital management platform for smarter healthcare delivery.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Features</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Security</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Integration</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Blog</a></li>
                <li><a href="#contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Help Center</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">API Reference</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Community</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © 2025 MediSync Hospital Management System. Built with React, Tailwind CSS & Supabase.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm">Privacy</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm">Terms</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
