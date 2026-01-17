"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Hero from "@/components/hero"
import FoodGallery from "@/components/food-gallery"
import MenuSection from "@/components/menu-section"
import About from "@/components/about"
import Reviews from "@/components/reviews"
import OrderSection from "@/components/order-section"
import Footer from "@/components/footer"
import SplashScreen from "@/components/splash-screen"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <main className="min-h-screen bg-background">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Header />
        <Hero />
        <FoodGallery />
        <MenuSection />
        <About />
        <Reviews />
        <OrderSection />
        <Footer />
      </motion.div>
    </main>
  )
}
