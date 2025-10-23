import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Shield, Stethoscope, Pill } from 'lucide-react'

export default function LoadingPage() {
  const [loadingText, setLoadingText] = useState('Loading your secure MediSync Dashboard')
  const [dots, setDots] = useState('')

  useEffect(() => {
    // Animate loading text dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)

    return () => clearInterval(dotsInterval)
  }, [])

  // Floating icon animation variants
  const floatingIconVariants = {
    animate: (custom) => ({
      y: [0, -20, 0],
      opacity: [0.2, 0.3, 0.2],
      transition: {
        duration: 4 + custom,
        repeat: Infinity,
        ease: "easeInOut",
        delay: custom * 0.5
      }
    })
  }

  // Circuit dot animation
  const circuitDotVariants = {
    animate: {
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#E6F1FA] via-[#FFFFFF] to-[#F8FFFB]">
      {/* Soft Center Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-[600px] h-[600px] bg-white/60 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Medical Icons - Cute Style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stethoscope */}
        <motion.div
          custom={0}
          variants={floatingIconVariants}
          animate="animate"
          className="absolute top-[15%] left-[10%]"
        >
          <Stethoscope className="w-20 h-20 text-blue-400/25" strokeWidth={1.5} />
        </motion.div>

        {/* Heart */}
        <motion.div
          custom={1}
          variants={floatingIconVariants}
          animate="animate"
          className="absolute top-[25%] right-[15%]"
        >
          <Heart className="w-24 h-24 text-pink-400/25" strokeWidth={1.5} />
        </motion.div>

        {/* Pill */}
        <motion.div
          custom={2}
          variants={floatingIconVariants}
          animate="animate"
          className="absolute bottom-[20%] left-[15%]"
        >
          <Pill className="w-16 h-16 text-green-400/25" strokeWidth={1.5} />
        </motion.div>

        {/* Shield */}
        <motion.div
          custom={1.5}
          variants={floatingIconVariants}
          animate="animate"
          className="absolute bottom-[30%] right-[12%]"
        >
          <Shield className="w-22 h-22 text-indigo-400/25" strokeWidth={1.5} />
        </motion.div>

        {/* Additional Small Hearts */}
        <motion.div
          custom={2.5}
          variants={floatingIconVariants}
          animate="animate"
          className="absolute top-[60%] left-[25%]"
        >
          <Heart className="w-12 h-12 text-red-300/20" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          custom={3}
          variants={floatingIconVariants}
          animate="animate"
          className="absolute top-[45%] right-[25%]"
        >
          <Heart className="w-14 h-14 text-pink-300/20" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Gentle Rising Sparkles/Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${Math.random() * 100}%`,
              y: '110%',
            }}
            animate={{
              y: '-10%',
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear"
            }}
            className="absolute"
          >
            <div 
              className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-300/40 to-green-300/40"
              style={{
                filter: 'blur(1px)',
                boxShadow: '0 0 8px rgba(96, 165, 250, 0.3)'
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Container with Soft Glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
          className="relative mb-12"
        >
          {/* Soft Halo Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 -m-16 bg-gradient-to-r from-blue-400/25 via-teal-400/25 to-green-400/25 rounded-full blur-3xl"
          />

          {/* Logo with Heartbeat Pulse */}
          <motion.div
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.1, 1]
            }}
            className="relative"
          >
            <div className="relative rounded-full">
              <img 
                src="/logo.png" 
                alt="MediSync Logo" 
                className="w-64 h-64 rounded-full"
                style={{
                  filter: 'drop-shadow(0 10px 50px rgba(59, 130, 246, 0.3))'
                }}
              />

              {/* Heartbeat Pulse Ring */}
              <motion.div
                animate={{
                  scale: [1, 1.35, 1.6],
                  opacity: [0.7, 0.35, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                  times: [0, 0.5, 1]
                }}
                className="absolute inset-0 border-4 border-blue-400/50 rounded-full"
              />

              {/* Secondary Pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.35, 1.6],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                  times: [0, 0.5, 1],
                  delay: 0.15
                }}
                className="absolute inset-0 border-4 border-green-400/40 rounded-full"
              />

              {/* Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -inset-4"
              >
                <div 
                  className="w-full h-full border-2 border-transparent border-t-blue-400/30 border-r-green-400/30 rounded-full" 
                  style={{ width: 'calc(100% + 32px)', height: 'calc(100% + 32px)' }} 
                />
              </motion.div>
            </div>

            {/* Circuit Dots traveling around logo */}
            {[0, 90, 180, 270].map((angle, i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.25
                }}
                className="absolute inset-0"
                style={{ transformOrigin: 'center' }}
              >
                <motion.div
                  animate={{
                    scale: [0.8, 1.3, 0.8],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.15
                  }}
                  className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    marginLeft: '145px',
                    marginTop: '-6px',
                    filter: 'blur(0.5px)',
                    boxShadow: '0 0 16px rgba(96, 165, 250, 0.9)'
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Brand Name with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 bg-clip-text text-transparent mb-3"
            style={{
              textShadow: '0 0 40px rgba(59, 130, 246, 0.15)'
            }}
          >
            MediSync
          </h1>
          <p className="text-gray-500 text-sm tracking-wide font-medium">
            Hospital Management System
          </p>
        </motion.div>

        {/* Animated Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-gray-600 text-lg font-medium"
          >
            {loadingText}{dots}
          </motion.p>
        </motion.div>

        {/* Cute Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-3"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15
              }}
              className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-green-400"
              style={{
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
              }}
            />
          ))}
        </motion.div>

        {/* Bottom Badges - Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex gap-6 mt-16"
        >
          {[
            { icon: Shield, label: 'Secure', gradient: 'from-blue-400 to-blue-500' },
            { icon: Heart, label: 'Care', gradient: 'from-pink-400 to-red-500' },
            { icon: Stethoscope, label: 'Professional', gradient: 'from-teal-400 to-green-500' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7 + index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3
                }}
                className={`p-3 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg`}
                style={{
                  boxShadow: '0 8px 20px rgba(96, 165, 250, 0.3)'
                }}
              >
                <item.icon className="w-5 h-5 text-white" strokeWidth={2} />
              </motion.div>
              <span className="text-xs text-gray-500 font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
