import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Premium Loading Screen for MediSync
 * Features: Advanced animations, DNA helix, pulse effects, medical patterns
 */
export default function PremiumLoadingScreen({ onLoadComplete }) {
  const [progress, setProgress] = useState(0)
  const [loadingPhase, setLoadingPhase] = useState('initializing')

  const phases = [
    { value: 0, label: 'Initializing System...' },
    { value: 25, label: 'Loading Healthcare Modules...' },
    { value: 50, label: 'Connecting to Database...' },
    { value: 75, label: 'Synchronizing Patient Data...' },
    { value: 100, label: 'Ready!' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          if (onLoadComplete) {
            setTimeout(() => onLoadComplete(), 800)
          }
          return 100
        }
        return prev + 1
      })
    }, 40)

    return () => clearInterval(timer)
  }, [onLoadComplete])

  useEffect(() => {
    if (progress >= 75) setLoadingPhase('syncing')
    else if (progress >= 50) setLoadingPhase('connecting')
    else if (progress >= 25) setLoadingPhase('loading')
    else setLoadingPhase('initializing')
  }, [progress])

  const currentPhase = phases.find(p => progress >= p.value && progress < (phases[phases.indexOf(p) + 1]?.value || 101))

  // DNA Helix points
  const dnaPoints = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30),
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#E6F1FA] via-[#F8FBFF] to-[#E6F1FA] overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0EA5E9" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* DNA Helix Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="relative w-64 h-96">
          {dnaPoints.map((point, index) => (
            <motion.div
              key={point.id}
              className="absolute w-3 h-3 bg-blue-500 rounded-full"
              style={{
                left: '50%',
                top: `${(index / 12) * 100}%`,
              }}
              animate={{
                x: [
                  Math.cos((point.angle * Math.PI) / 180) * 60,
                  Math.cos(((point.angle + 180) * Math.PI) / 180) * 60,
                ],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Radial Pulse Waves */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-blue-400"
          style={{
            width: '400px',
            height: '400px',
            left: '50%',
            top: '50%',
            marginLeft: '-200px',
            marginTop: '-200px',
          }}
          animate={{
            scale: [1, 2, 2],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl px-8">
        {/* Logo Container with Advanced Effects */}
        <div className="relative mb-12">
          {/* Orbiting Dots */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <motion.div
              key={angle}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * 150,
                y: Math.sin((angle * Math.PI) / 180) * 150,
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Pulsing Background Glow */}
          <motion.div
            className="absolute inset-0 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-80 h-80 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-full" />
          </motion.div>

          {/* Main Logo */}
          <motion.div
            className="relative z-10"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 4, repeat: Infinity },
            }}
          >
            <div className="relative">
              <motion.img
                src="/logo.png"
                alt="MediSync Logo"
                className="w-72 h-72 object-contain drop-shadow-2xl filter"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(14, 165, 233, 0.5))',
                }}
              />

              {/* Scanning Line Effect */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-full"
                initial={{ y: '100%' }}
                animate={{ y: '-100%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-full h-20 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
              </motion.div>

              {/* Heartbeat Pulse */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              >
                <div className="w-full h-1 bg-red-500/50 blur-sm" />
              </motion.div>
            </div>
          </motion.div>

          {/* Energy Rings */}
          {[160, 200, 240].map((size, i) => (
            <motion.div
              key={size}
              className="absolute left-1/2 top-1/2 rounded-full border border-blue-500/30"
              style={{
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
              }}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity },
              }}
            />
          ))}
        </div>

        {/* Brand Text */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1
            className="text-5xl font-bold mb-3"
            style={{
              background: 'linear-gradient(90deg, #0EA5E9 0%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            MediSync
          </motion.h1>
          <p className="text-gray-500 text-sm font-medium tracking-wider uppercase">
            Hospital Management System
          </p>
        </motion.div>

        {/* Loading Status with Phase Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={loadingPhase}
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
              <p className="text-lg font-semibold text-gray-700">
                {currentPhase?.label || 'Loading...'}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Advanced Progress Bar */}
        <div className="w-full max-w-lg">
          <div className="relative h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
            {/* Progress Fill */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0EA5E9 0%, #06B6D4 50%, #10B981 100%)',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)',
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Particle Trail */}
              <motion.div
                className="absolute right-0 w-4 h-4 bg-white rounded-full -mr-2 -mt-0.5"
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(255, 255, 255, 0.5)',
                    '0 0 20px rgba(14, 165, 233, 0.8)',
                    '0 0 10px rgba(255, 255, 255, 0.5)',
                  ],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </div>

          {/* Progress Percentage */}
          <div className="flex justify-between items-center mt-3">
            <motion.span
              className="text-sm font-bold text-gray-700"
              key={progress}
              initial={{ scale: 1.2, color: '#0EA5E9' }}
              animate={{ scale: 1, color: '#374151' }}
              transition={{ duration: 0.2 }}
            >
              {progress}%
            </motion.span>
            <span className="text-xs text-gray-500">
              {progress < 100 ? 'Please wait...' : 'Complete!'}
            </span>
          </div>
        </div>

        {/* System Status Indicators */}
        <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-lg">
          {[
            { label: 'Database', active: progress > 25 },
            { label: 'API', active: progress > 50 },
            { label: 'Security', active: progress > 75 },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  item.active ? 'bg-green-500' : 'bg-gray-300'
                }`}
                animate={
                  item.active
                    ? {
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
              <span className="text-xs font-medium text-gray-600">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Corner Accents with Gradient */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 opacity-30"
        style={{
          background: 'radial-gradient(circle at top left, #0EA5E9 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 opacity-30"
        style={{
          background: 'radial-gradient(circle at bottom right, #10B981 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 2,
        }}
      />
    </div>
  )
}
