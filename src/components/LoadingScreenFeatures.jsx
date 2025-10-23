import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Shield, Stethoscope, Sparkles, CircuitBoard, Zap } from 'lucide-react'

/**
 * LoadingScreenFeatures - Visual guide showing loading screen features
 * Can be embedded in documentation or demo pages
 */
export default function LoadingScreenFeatures() {
  const features = [
    {
      icon: Heart,
      title: 'Heartbeat Pulse',
      description: 'Logo pulses like a real heartbeat with dual wave rings',
      color: 'from-pink-400 to-red-500',
      demo: true
    },
    {
      icon: CircuitBoard,
      title: 'Circuit Dots',
      description: 'Glowing particles orbit the logo representing data flow',
      color: 'from-blue-400 to-cyan-500',
      demo: true
    },
    {
      icon: Stethoscope,
      title: 'Floating Icons',
      description: 'Medical symbols gently float in the background',
      color: 'from-teal-400 to-green-500',
      demo: true
    },
    {
      icon: Sparkles,
      title: 'Rising Bubbles',
      description: 'Soft particles continuously rise for depth',
      color: 'from-indigo-400 to-purple-500',
      demo: true
    },
    {
      icon: Shield,
      title: 'Trust Badges',
      description: 'Secure, Care, and Professional indicators',
      color: 'from-blue-500 to-indigo-600',
      demo: false
    },
    {
      icon: Zap,
      title: 'Smooth Transitions',
      description: 'Elegant fade-in/out with blur effects',
      color: 'from-yellow-400 to-orange-500',
      demo: false
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Loading Screen Features
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Elegant animations that create a premium healthcare experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl hover:shadow-lg transition-all">
              {/* Icon with Gradient */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
              >
                <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
              </motion.div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {feature.description}
              </p>

              {/* Demo Badge */}
              {feature.demo && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Animated
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { name: 'React', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
            { name: 'Framer Motion', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
            { name: 'Tailwind CSS', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
            { name: 'Lucide Icons', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' }
          ].map((tech) => (
            <span
              key={tech.name}
              className={`px-4 py-2 rounded-full text-sm font-medium ${tech.color}`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div className="mt-8">
        <h3 className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Color Palette
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { color: '#E6F1FA', label: 'Sky' },
            { color: '#F8FFFB', label: 'Mint' },
            { color: '#3B82F6', label: 'Blue' },
            { color: '#10B981', label: 'Green' },
            { color: '#EC4899', label: 'Pink' },
            { color: '#8B5CF6', label: 'Purple' }
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-lg shadow-md border-2 border-white dark:border-gray-700"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
