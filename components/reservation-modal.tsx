"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
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
const DATE_RANGE_DAYS = 30
const TIME_STEP_MINUTES = 30

const toDateValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

const formatTimeLabel = (value: string) => {
  const [hour, minute] = value.split(":").map(Number)
  const temp = new Date()
  temp.setHours(hour, minute, 0, 0)
  return temp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

const parseDateValue = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const getDayCategory = (dateObj: Date) => {
  const dayOfWeek = dateObj.getDay()
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return "Mon-Fri"
  }
  if (dayOfWeek === 6) {
    return "Saturday"
  }
  return "Sunday"
}

const getBusinessHours = (dateObj: Date) => {
  const dayCategory = getDayCategory(dateObj)
  return BUSINESS_HOURS.find((h) => h.day === dayCategory)
}

const buildCalendarDays = (month: Date, minDate: Date, maxDate: Date) => {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const startWeekday = monthStart.getDay()
  const days: { date: Date; inMonth: boolean; disabled: boolean }[] = []

  for (let i = startWeekday; i > 0; i -= 1) {
    const date = new Date(monthStart)
    date.setDate(monthStart.getDate() - i)
    days.push({ date, inMonth: false, disabled: true })
  }

  for (let day = 1; day <= monthEnd.getDate(); day += 1) {
    const date = new Date(monthStart)
    date.setDate(day)
    const disabled = date < minDate || date > maxDate
    days.push({ date, inMonth: true, disabled })
  }

  while (days.length < 42) {
    const date = new Date(monthEnd)
    date.setDate(monthEnd.getDate() + (days.length - (startWeekday + monthEnd.getDate()) + 1))
    days.push({ date, inMonth: false, disabled: true })
  }

  return days
}

const buildTimeSlots = (dateValue: string) => {
  if (!dateValue) return []
  const dateObj = parseDateValue(dateValue)
  const hours = getBusinessHours(dateObj)
  if (!hours) return []

  const [openHour, openMin] = hours.open.split(":").map(Number)
  const [closeHour, closeMin] = hours.close.split(":").map(Number)
  const openInMinutes = openHour * 60 + openMin
  const closeInMinutes = closeHour * 60 + closeMin
  const slots: { value: string; label: string }[] = []

  for (let minutes = openInMinutes; minutes < closeInMinutes; minutes += TIME_STEP_MINUTES) {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    slots.push({ value, label: formatTimeLabel(value) })
  }

  return slots
}

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
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = prefersReducedMotion || isMobile
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isTimeOpen, setIsTimeOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return startOfMonth(today)
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const rangeEnd = new Date(today)
  rangeEnd.setDate(rangeEnd.getDate() + DATE_RANGE_DAYS - 1)

  const calendarDays = buildCalendarDays(calendarMonth, today, rangeEnd)
  const availableTimes = buildTimeSlots(formData.date)
  const selectedDate = formData.date ? parseDateValue(formData.date) : null
  const selectedDateLabel = selectedDate ? formatDateLabel(selectedDate) : "Select a date"
  const selectedTimeLabel = formData.time ? formatTimeLabel(formData.time) : "Select a time"
  const canGoPrevMonth = calendarMonth > startOfMonth(today)
  const canGoNextMonth = calendarMonth < startOfMonth(rangeEnd)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)")
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  const isRestaurantOpen = (date: string, time: string): boolean => {
    if (!date || !time) return true // Pass validation if not filled yet

    const dateObj = parseDateValue(date)
    const hours = getBusinessHours(dateObj)
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

  const handleDateSelect = (value: string) => {
    handleDateTimeChange(value, "")
    setIsDateOpen(false)
    setIsTimeOpen(true)
  }

  const handleTimeSelect = (value: string) => {
    handleDateTimeChange(formData.date, value)
    setIsTimeOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.date || !formData.time) {
      setError("Please select a date and time.")
      return
    }

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
          transition={{ duration: reduceMotion ? 0.2 : 0.35 }}
          onClick={onClose}
          className={`fixed inset-0 bg-black/50 ${isMobile ? "" : "backdrop-blur-sm"} z-50 flex items-center justify-center p-4`}
        >
          {isSubmitted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.3 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-51"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={reduceMotion ? { duration: 0.2 } : { type: "spring", stiffness: 260, damping: 20 }}
                className="bg-background rounded-3xl shadow-2xl p-8 max-w-sm mx-auto text-center pointer-events-auto"
              >
                {/* Success Icon Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={
                    reduceMotion ? { duration: 0.2 } : { delay: 0.2, type: "spring", stiffness: 200 }
                  }
                  className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: reduceMotion ? 0 : 0.4, duration: reduceMotion ? 0.2 : 0.3 }}
                  >
                    <Check size={40} className="text-primary-foreground" strokeWidth={3} />
                  </motion.div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.3, duration: reduceMotion ? 0.2 : 0.3 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  Table Reserved!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduceMotion ? 0 : 0.4, duration: reduceMotion ? 0.2 : 0.3 }}
                  className="text-foreground/70 mb-6"
                >
                  Your reservation has been confirmed. We'll see you soon at MANNA!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduceMotion ? 0 : 0.5, duration: reduceMotion ? 0.2 : 0.3 }}
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
                  transition={{ delay: reduceMotion ? 0 : 0.6, duration: reduceMotion ? 0.2 : 0.3 }}
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
              transition={{ duration: reduceMotion ? 0.2 : 0.35 }}
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
                transition={{ delay: reduceMotion ? 0 : 0.1, duration: reduceMotion ? 0.2 : 0.3 }}
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.1, duration: reduceMotion ? 0.2 : 0.3 }}
                >
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.15, duration: reduceMotion ? 0.2 : 0.3 }}
                >
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.2, duration: reduceMotion ? 0.2 : 0.3 }}
                >
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
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
                  transition={{ delay: reduceMotion ? 0 : 0.25, duration: reduceMotion ? 0.2 : 0.3 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Calendar size={16} /> Date
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDateOpen((prev) => !prev)
                          setIsTimeOpen(false)
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-left text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      >
                        {selectedDateLabel}
                      </button>
                      {isDateOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: reduceMotion ? 0.2 : 0.3 }}
                          className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-background p-3 shadow-xl"
                        >
                          <div className="flex items-center justify-between px-1 pb-2">
                            <button
                              type="button"
                              onClick={() =>
                                setCalendarMonth(
                                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                                )
                              }
                              disabled={!canGoPrevMonth}
                              className="rounded-lg px-2 py-1 text-xs font-semibold text-foreground hover:bg-muted/60 transition disabled:opacity-40"
                            >
                              Prev
                            </button>
                            <span className="text-sm font-semibold text-foreground">
                              {calendarMonth.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setCalendarMonth(
                                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                                )
                              }
                              disabled={!canGoNextMonth}
                              className="rounded-lg px-2 py-1 text-xs font-semibold text-foreground hover:bg-muted/60 transition disabled:opacity-40"
                            >
                              Next
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-[11px] uppercase text-foreground/50 mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                              <span key={day} className="text-center">
                                {day}
                              </span>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day) => {
                              const dateValue = toDateValue(day.date)
                              const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : false
                              const isToday = isSameDay(day.date, today)
                              const isDisabled = day.disabled

                              return (
                                <button
                                  key={dateValue}
                                  type="button"
                                  onClick={() => handleDateSelect(dateValue)}
                                  disabled={isDisabled}
                                  className={`h-9 w-9 rounded-lg text-xs font-semibold transition ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : isToday
                                        ? "border border-primary text-primary"
                                        : "text-foreground"
                                  } ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-muted/60"}`}
                                >
                                  {day.date.getDate()}
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Clock size={16} /> Time
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.date) return
                          setIsTimeOpen((prev) => !prev)
                          setIsDateOpen(false)
                        }}
                        disabled={!formData.date}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-left text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {formData.date ? selectedTimeLabel : "Select date first"}
                      </button>
                      {isTimeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: reduceMotion ? 0.2 : 0.3 }}
                          className="absolute z-20 mt-2 w-full max-h-56 overflow-y-auto rounded-xl border border-border bg-background p-2 shadow-xl"
                        >
                          {availableTimes.length ? (
                            availableTimes.map((time) => (
                              <button
                                key={time.value}
                                type="button"
                                onClick={() => handleTimeSelect(time.value)}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                                  formData.time === time.value
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted/60 text-foreground"
                                }`}
                              >
                                {time.label}
                              </button>
                            ))
                          ) : (
                            <p className="px-3 py-2 text-sm text-foreground/60">No available times.</p>
                          )}
                        </motion.div>
                      )}
                    </div>
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.3, duration: reduceMotion ? 0.2 : 0.3 }}
                >
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
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
                  transition={{ delay: reduceMotion ? 0 : 0.35, duration: reduceMotion ? 0.2 : 0.3 }}
                  type="submit"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
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
