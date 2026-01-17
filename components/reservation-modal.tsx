"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock, Users, Mail, Phone, Check, AlertCircle } from "lucide-react"

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
}

const BUSINESS_HOURS = [
  { day: "Mon-Fri", open: "11:00", close: "19:00" }, // 11 AM - 7 PM
  { day: "Saturday", open: "11:00", close: "17:00" }, // 11 AM - 5 PM
  { day: "Sunday", open: "13:00", close: "17:00" }, // 1 PM - 5 PM
]

export default function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const isRestaurantOpen = (date: string, time: string): boolean => {
    if (!date || !time) return true // Pass validation if not filled yet

    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay()

    // Determine day category
    let dayCategory = ""
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      dayCategory = "Mon-Fri"
    } else if (dayOfWeek === 6) {
      dayCategory = "Saturday"
    } else if (dayOfWeek === 0) {
      dayCategory = "Sunday"
    }

    const hours = BUSINESS_HOURS.find((h) => h.day === dayCategory)
    if (!hours) return false

    const [timeHour, timeMin] = time.split(":").map(Number)
    const [openHour, openMin] = hours.open.split(":").map(Number)
    const [closeHour, closeMin] = hours.close.split(":").map(Number)

    const timeInMinutes = timeHour * 60 + timeMin
    const openInMinutes = openHour * 60 + openMin
    const closeInMinutes = closeHour * 60 + closeMin

    return timeInMinutes >= openInMinutes && timeInMinutes < closeInMinutes
  }

  const handleDateTimeChange = (date: string, time: string) => {
    setFormData((prev) => ({ ...prev, date, time }))

    if (date && time && !isRestaurantOpen(date, time)) {
      setError("Restaurant is closed at this time. Please check our hours.")
    } else {
      setError("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isRestaurantOpen(formData.date, formData.time)) {
      setError("Please select a time when we are open.")
      return
    }

    console.log("Reservation:", formData)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", phone: "", date: "", time: "", guests: "" })
      setError("")
      onClose()
    }, 3000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {isSubmitted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-51"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-background rounded-3xl shadow-2xl p-8 max-w-sm mx-auto text-center pointer-events-auto"
              >
                {/* Success Icon Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}>
                    <Check size={40} className="text-primary-foreground" strokeWidth={3} />
                  </motion.div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  Table Reserved!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-foreground/70 mb-6"
                >
                  Your reservation has been confirmed. We'll see you soon at MANNA!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2 text-sm text-foreground/60 mb-6 bg-muted/50 p-4 rounded-lg"
                >
                  <p>
                    <span className="font-semibold">Name:</span> {formData.name}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span> {formData.date}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span> {formData.time}
                  </p>
                  <p>
                    <span className="font-semibold">Guests:</span> {formData.guests}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs text-foreground/50"
                >
                  Redirecting in 3 seconds...
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Form Modal */}
          {!isSubmitted && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between p-6 bg-primary text-primary-foreground border-b border-primary/20">
                <div>
                  <h2 className="text-2xl font-bold">Reserve a Table</h2>
                  <p className="text-primary-foreground/80 text-sm mt-1">Join us for an unforgettable meal</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-primary-foreground/20 rounded-lg transition">
                  <X size={24} />
                </button>
              </div>

              {/* Business Hours Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-muted/50 border-b border-border"
              >
                <p className="text-sm font-semibold text-foreground mb-3">Our Hours</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-foreground/70">
                  <div>Mon-Fri: 11 AM - 7 PM</div>
                  <div>Saturday: 11 AM - 5 PM</div>
                  <div>Sunday: 1 PM - 5 PM</div>
                </div>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    placeholder="Your full name"
                  />
                </motion.div>

                {/* Email */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    placeholder="your@email.com"
                  />
                </motion.div>

                {/* Phone */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Phone size={16} /> Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    placeholder="+233 XXX XXX XXX"
                  />
                </motion.div>

                {/* Date & Time Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Calendar size={16} /> Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => handleDateTimeChange(e.target.value, formData.time)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Clock size={16} /> Time
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => handleDateTimeChange(formData.date, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle size={18} className="text-red-600" />
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}

                {/* Guests */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Users size={16} /> Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    placeholder="2"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!!error}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reserve Table Now
                </motion.button>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
