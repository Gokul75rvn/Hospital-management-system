import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#E6F1FA] via-white to-[#F0F9FF] overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {/* ECG Line Pattern */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ecg-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
              <motion.path
                d="M0,50 L40,50 L45,30 L50,70 L55,20 L60,50 L200,50"
                stroke="#0EA5E9"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ecg-pattern)" />
        </svg>

        {/* Medical Icons Pattern */}
        <div className="absolute top-20 left-20 opacity-30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#22D3EE">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </motion.div>
        </div>

        <div className="absolute bottom-32 right-32 opacity-30">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#10B981">
              <circle cx="12" cy="12" r="10" strokeWidth={0.5} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6v6l4 2" />
            </svg>
          </motion.div>
        </div>

        <div className="absolute top-1/3 right-20 opacity-30">
          <motion.svg
            width="70"
            height="70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0EA5E9"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
          </motion.svg>
        </div>
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Rotating Glow Halo */}
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)',
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Pulsing Ring */}
        <motion.div
          className="absolute w-72 h-72 rounded-full border-2 border-blue-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Logo Container with Animations */}
        <div className="relative">
          {/* Glowing Background */}
          <motion.div
            className="absolute inset-0 blur-3xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-64 h-64 bg-gradient-to-r from-blue-400 to-green-400 rounded-full" />
          </motion.div>

          {/* Main Logo with Pulse */}
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.img
              src="/logo.png"
              alt="MediSync Logo"
              className="w-64 h-64 object-contain drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Heartbeat Animation Overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-40 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent" />
            </motion.div>
          </motion.div>

          {/* Circuit Lines Animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
              <motion.div
                key={angle}
                className="absolute top-1/2 left-1/2 w-32 h-0.5"
                style={{
                  transformOrigin: 'left center',
                  transform: `rotate(${angle}deg)`,
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              >
                <div className="w-full h-full bg-gradient-to-r from-blue-400 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Loading Text with Gradient */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(90deg, #0EA5E9 0%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            MediSync
          </motion.h2>
          
          <motion.p
            className="text-gray-600 text-lg font-medium mb-6"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Loading Dashboard<motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >...</motion.span>
          </motion.p>

          {/* Progress Bar */}
          <div className="w-80 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-full relative"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            <motion.p
              className="text-sm text-gray-500 mt-2 font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {progress}% Complete
            </motion.p>
          </div>
        </motion.div>

        {/* Status Messages */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 text-sm text-gray-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Initializing Healthcare Portal
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-12 opacity-30">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-blue-400 to-transparent rounded-full"
              style={{ height: `${(i + 1) * 20}px` }}
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner Accents */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 opacity-20"
        style={{
          background: 'radial-gradient(circle at top left, #0EA5E9 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 opacity-20"
        style={{
          background: 'radial-gradient(circle at bottom right, #10B981 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />
    </div>
  )
}
