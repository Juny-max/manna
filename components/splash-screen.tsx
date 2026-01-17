"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 600)
    }, 2800)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center pointer-events-none"
    >
      {/* Logo Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center">
          <img src="/images/manna.jpg" alt="MANNA Logo" className="w-full h-full object-contain" />
        </div>
      </motion.div>

      {/* Food Text Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="space-y-2 text-center mb-8 text-sm text-foreground/60"
      >
        <p>Quality Restaurant-Level Food</p>
        <p>Quick Service • Great Value</p>
      </motion.div>

      {/* Loading Animation - Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
            className="w-3 h-3 bg-primary rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
