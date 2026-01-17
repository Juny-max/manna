"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoAvailable, setVideoAvailable] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoAvailable) return

    video.play().catch((err) => console.log("[v0] Video play error:", err))
  }, [videoAvailable])

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 flex items-center min-h-screen">
      <div className="absolute inset-0">
        {videoAvailable ? (
          <video
            ref={videoRef}
            src="/images/video2.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onContextMenu={(e) => e.preventDefault()}
            onError={() => {
              console.log("[v0] Local video failed to load, showing fallback poster")
              setVideoAvailable(false)
            }}
            className="hero-video absolute inset-0 w-full h-full object-cover z-0 opacity-80 pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
            <img src="/images/placeholder.jpg" alt="MANNA" className="w-full h-full object-cover" />
          </div>
        )}
        {/* Gradient overlay placed above video — captures pointer events so video stays untouchable */}
        <div className="absolute inset-0 z-10 hero-overlay bg-gradient-to-r from-background/90 via-background/60 to-background/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content with animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-medium text-accent tracking-widest uppercase"
              >
                Welcome to MANNA
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance"
              >
                Authentic Ghanaian Food
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-foreground/80 text-pretty"
              >
                Experience quality restaurant-level food with quick service. Mix and match your perfect meal from our
                diverse menu of small chops, carbs, proteins, and delicious sauces.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#order"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition active:scale-95"
              >
                Order Now
              </a>
              <a
                href="#menu"
                className="inline-flex items-center justify-center bg-muted text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-muted/80 transition border border-border active:scale-95"
              >
                View Menu
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-6 pt-8"
            >
              <div className="p-4 bg-card rounded-lg border border-border/50">
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-sm text-foreground/70">Quality Guaranteed</p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border/50">
                <p className="text-2xl font-bold text-primary">Quick</p>
                <p className="text-sm text-foreground/70">Fast Service</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/sausage-20rolls.jpg"
                alt="Sausage Rolls - MANNA Special"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute top-8 right-8 w-32 h-32 bg-accent/20 rounded-2xl -z-10"></div>
            <div className="absolute bottom-8 left-8 w-40 h-40 bg-secondary/20 rounded-full -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
