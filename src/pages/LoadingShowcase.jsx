import React, { useState } from 'react'
import { motion } from 'framer-motion'
import LoadingScreen from '../components/LoadingScreen'
import PremiumLoadingScreen from '../components/PremiumLoadingScreen'
import { Link } from 'react-router-dom'

export default function LoadingShowcase() {
  const [activeDemo, setActiveDemo] = useState(null)

  const demos = [
    {
      id: 'standard',
      name: 'Standard Loading',
      description: 'Elegant healthcare-focused loading with heartbeat and circuit animations',
      component: LoadingScreen,
      features: [
        'Heartbeat pulse animation',
        'Circuit line sequences',
        'Floating particles',
        'ECG background patterns',
        'Progress bar with shimmer',
      ],
    },
    {
      id: 'premium',
      name: 'Premium Loading',
      description: 'Advanced loading with DNA helix, orbiting elements, and phase tracking',
      component: PremiumLoadingScreen,
      features: [
        'DNA helix animation',
        'Orbiting particles',
        'Scanning line effect',
        'Phase-based status updates',
        'System status indicators',
        '3D energy rings',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F1FA] to-white">
      {activeDemo ? (
        <div className="relative">
          {activeDemo === 'standard' ? (
            <LoadingScreen />
          ) : (
            <PremiumLoadingScreen
              onLoadComplete={() => {
                setTimeout(() => setActiveDemo(null), 1000)
              }}
            />
          )}
          <button
            onClick={() => setActiveDemo(null)}
            className="absolute top-8 right-8 z-[60] px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
          >
            ← Back to Showcase
          </button>
        </div>
      ) : (
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo.png" alt="MediSync" className="w-16 h-16" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MediSync
              </h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Loading Screen Showcase
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional animated loading screens designed for healthcare applications.
              Choose your preferred style below.
            </p>
          </motion.div>

          {/* Demo Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200"
              >
                {/* Preview Image Area */}
                <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <img
                      src="/logo.png"
                      alt={demo.name}
                      className="w-32 h-32 object-contain opacity-50"
                    />
                  </motion.div>

                  {/* Preview Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                    {demo.id === 'premium' ? '✨ Advanced' : '⚡ Standard'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {demo.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {demo.description}
                  </p>

                  {/* Features List */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Features
                    </h4>
                    <ul className="space-y-2">
                      {demo.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveDemo(demo.id)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Demo
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Usage Guide */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                📚 Quick Implementation Guide
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Standard Loading</h4>
                  <pre className="bg-white rounded-lg p-4 text-sm overflow-x-auto border border-gray-200">
                    <code className="text-gray-800">{`import LoadingScreen from './components/LoadingScreen'

function App() {
  const [loading, setLoading] = useState(true)
  
  if (loading) {
    return <LoadingScreen />
  }
  
  return <YourApp />
}`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Premium Loading</h4>
                  <pre className="bg-white rounded-lg p-4 text-sm overflow-x-auto border border-gray-200">
                    <code className="text-gray-800">{`import PremiumLoadingScreen from './components/PremiumLoadingScreen'

function App() {
  return (
    <PremiumLoadingScreen
      onLoadComplete={() => {
        // Navigate or show content
      }}
    />
  )
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="/LOADING_SCREEN_GUIDE.md"
                  target="_blank"
                  className="px-6 py-3 bg-white text-gray-700 rounded-lg font-medium hover:shadow-lg transition-all border border-gray-200"
                >
                  📖 Full Documentation
                </a>
                <a
                  href="/LOADING_QUICKSTART.md"
                  target="_blank"
                  className="px-6 py-3 bg-white text-gray-700 rounded-lg font-medium hover:shadow-lg transition-all border border-gray-200"
                >
                  🚀 Quick Start Guide
                </a>
              </div>
            </div>
          </motion.div>

          {/* Technical Specs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 max-w-4xl mx-auto text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'React', value: '18.2+' },
                { label: 'Framer Motion', value: '10.x' },
                { label: 'Tailwind CSS', value: '3.x' },
                { label: 'Performance', value: '60 FPS' },
              ].map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="p-4 bg-white rounded-xl shadow-md"
                >
                  <div className="text-2xl font-bold text-blue-600">{spec.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{spec.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
