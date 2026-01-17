"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import ReservationModal from "./reservation-modal"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isReservationOpen, setIsReservationOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center"
            >
              <div className="w-12 h-12 relative">
                <img src="/images/manna.jpg" alt="MANNA Logo" className="w-full h-full object-contain" />
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#menu" className="text-foreground hover:text-primary transition font-medium">
                Menu
              </a>
              <a href="#reviews" className="text-foreground hover:text-primary transition font-medium">
                Reviews
              </a>
              <a href="#order" className="text-foreground hover:text-primary transition font-medium">
                Order
              </a>
            </nav>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsReservationOpen(true)}
                className="hidden sm:inline-flex bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
              >
                Reserve Table
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg transition"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.nav
            initial={false}
            animate={isOpen ? { height: "auto" } : { height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="pb-6 space-y-3 flex flex-col">
              <a href="#menu" className="text-foreground hover:text-primary transition px-4 py-2 font-medium">
                Menu
              </a>
              <a href="#reviews" className="text-foreground hover:text-primary transition px-4 py-2 font-medium">
                Reviews
              </a>
              <a href="#order" className="text-foreground hover:text-primary transition px-4 py-2 font-medium">
                Order
              </a>
              <button
                onClick={() => {
                  setIsReservationOpen(true)
                  setIsOpen(false)
                }}
                className="text-foreground hover:text-primary transition px-4 py-2 font-medium text-left"
              >
                Reserve Table
              </button>
            </div>
          </motion.nav>
        </div>
      </header>

      <ReservationModal isOpen={isReservationOpen} onClose={() => setIsReservationOpen(false)} />
    </>
  )
}
