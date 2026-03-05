"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { MapPin, Clock, Phone, CheckCircle2, ChevronDown } from "lucide-react"
import ReservationModal from "./reservation-modal"
import DeliveryPartners from "./delivery-partners"
import { menuPages } from "@/lib/menu-data"

export default function OrderSection() {
  const [activeTab, setActiveTab] = useState<"order" | "delivery">("order")
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", items: "", delivery: "pickup" })
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedItems, setSelectedItems] = useState<Record<string, { label: string; price: string }>>({})
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = prefersReducedMotion || isMobile

  const deliveryOptions = [
    { value: "pickup", label: "Pickup" },
    { value: "delivery", label: "Delivery" },
  ]
  const deliveryLabel =
    deliveryOptions.find((option) => option.value === orderForm.delivery)?.label ?? "Select"

  const totalPages = menuPages.length
  const selectedEntries = Object.entries(selectedItems)
  const selectedList = selectedEntries.map(([, item]) => item)
  const selectedSummary = selectedList.length
    ? selectedList.map((item) => `${item.label} (${item.price})`).join(", ")
    : "No items selected yet."
  const totalPrice = selectedList.reduce((sum, item) => {
    const value = Number(item.price.replace(/[^0-9.]/g, ""))
    return Number.isNaN(value) ? sum : sum + value
  }, 0)
  const formattedTotal = `GHS ${totalPrice.toFixed(2)}`

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)")
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    setOrderForm((prev) => ({ ...prev, items: selectedSummary === "No items selected yet." ? "" : selectedSummary }))
  }, [selectedSummary])

  const handleToggleItem = (id: string, label: string, price: string) => {
    setSelectedItems((prev) => {
      const next = { ...prev }
      if (next[id]) {
        delete next[id]
      } else {
        next[id] = { label, price }
      }
      return next
    })
  }

  const handleOrderPreview = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSummaryOpen(true)
  }

  const handleOrderSubmit = () => {
    console.log("Order:", orderForm)
    setIsSummaryOpen(false)
    setIsConfirmOpen(true)
    setOrderForm({ name: "", phone: "", items: "", delivery: "pickup" })
    setSelectedItems({})
    setPageIndex(0)
  }

  return (
    <>
      <section id="order" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Forms */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0.3 : 0.5 }}
            >
              <div className="flex gap-3 mb-8 flex-col sm:flex-row">
                <button
                  onClick={() => setActiveTab("order")}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    activeTab === "order"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  Quick Order
                </button>
                <button
                  onClick={() => setActiveTab("delivery")}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    activeTab === "delivery"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  Delivery Platforms
                </button>
              </div>

              {activeTab === "order" ? (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0.25 : 0.4 }}
                    onSubmit={handleOrderPreview}
                    className="space-y-5 bg-card p-6 md:p-8 rounded-xl border border-border"
                  >
                  <h3 className="text-2xl font-bold text-foreground">Quick Order</h3>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      placeholder="+233 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">What would you like?</label>
                    <div className="flipbook-scene">
                      <div className="flipbook">
                        {menuPages.map((page, pageIdx) => {
                          const isFlipped = pageIdx < pageIndex
                          const isActive = pageIdx === pageIndex
                          const toneClass = page.tone === "dark" ? "title-dark" : "title-brown"

                          return (
                            <div
                              key={page.id}
                              className={`flip-page ${isFlipped ? "is-flipped" : ""} ${isActive ? "is-active" : ""}`}
                              style={{ zIndex: menuPages.length - pageIdx }}
                            >
                              <div className="flip-page-inner">
                                <div className="flip-page-header">
                                  <h4 className={`flip-page-title flip-title ${toneClass}`}>{page.title}</h4>
                                  <span className="flip-page-step">
                                    Page {pageIdx + 1} of {totalPages}
                                  </span>
                                </div>
                                <div className="flip-page-list">
                                  {page.items.map((item) => {
                                    const itemId = `${page.id}-${item.name}`
                                    const isChecked = Boolean(selectedItems[itemId])

                                    return (
                                      <label
                                        key={itemId}
                                        className={`flip-item ${isChecked ? "is-selected" : ""}`}
                                      >
                                        <span className="flip-item-main">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggleItem(itemId, item.name, item.price)}
                                          />
                                          <span className="flip-item-name">{item.name}</span>
                                        </span>
                                        <span className="flip-item-price">{item.price}</span>
                                      </label>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={pageIndex === 0}
                        className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous Page
                      </button>
                      <span className="text-xs text-foreground/60">Selected: {selectedList.length}</span>
                      <button
                        type="button"
                        onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={pageIndex === totalPages - 1}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next Page
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-foreground/60 line-clamp-2">{selectedSummary}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Delivery Method</label>
                    <button
                      type="button"
                      onClick={() => setIsDeliveryOpen(true)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition flex items-center justify-between"
                    >
                      <span className="font-medium">{deliveryLabel}</span>
                      <ChevronDown className="h-4 w-4 text-foreground/60" />
                    </button>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Place Order
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <DeliveryPartners />
                </motion.div>
              )}
            </motion.div>

            {/* Contact & Location */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0.3 : 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Visit Us</h2>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={reduceMotion ? undefined : { x: 8 }}
                  className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition cursor-pointer"
                >
                  <MapPin size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Location</h3>
                    <p className="text-foreground/70">Accra, Ghana</p>
                    <a
                      href="https://www.google.com/maps/search/MANNA+Accra+Ghana"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm mt-2 inline-block"
                    >
                      Get Directions
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={reduceMotion ? undefined : { x: 8 }}
                  className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition cursor-pointer"
                >
                  <Clock size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                    <p className="text-foreground/70">Mon - Fri: 10am - 10pm</p>
                    <p className="text-foreground/70">Sat - Sun: 11am - 11pm</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={reduceMotion ? undefined : { x: 8 }}
                  className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition cursor-pointer"
                >
                  <Phone size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Contact</h3>
                    <p className="text-foreground/70">Call for quick orders</p>
                    <a href="tel:+233" className="text-primary hover:underline font-medium">
                      +233 XXX XXX XXX
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Google Map Embed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="rounded-xl overflow-hidden border border-border shadow-lg"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31767.83012470021!2d-0.18207311565679224!3d5.570156882447584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b006adebfbb%3A0xba41c5d0054125d9!2sManna!5e0!3m2!1sen!2sgh!4v1768658732601!5m2!1sen!2sgh"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>

              {/* Reserve Button */}
              <motion.button
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => setIsReservationOpen(true)}
                className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Reserve Table
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {isSummaryOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center px-4 py-6">
          <div
            className={`absolute inset-0 bg-black/50 ${isMobile ? "" : "backdrop-blur-sm"}`}
            onClick={() => setIsSummaryOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.25 }}
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl overflow-hidden bg-background">
                <img src="/images/manna.jpg" alt="Manna" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Quick Order</p>
                <h3 className="text-xl font-bold text-foreground">Order Summary</h3>
              </div>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {selectedEntries.length ? (
                selectedEntries.map(([id, item]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.label}</p>
                      <p className="text-xs text-foreground/60">{item.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleItem(id, item.label, item.price)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground/60">No items selected yet.</p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-foreground/70">Total</span>
              <span className="text-lg font-semibold text-foreground">{formattedTotal}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsSummaryOpen(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/60 transition"
              >
                Add More
              </button>
              <button
                type="button"
                onClick={handleOrderSubmit}
                disabled={selectedEntries.length === 0}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Order
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
          <div
            className={`absolute inset-0 bg-black/50 ${isMobile ? "" : "backdrop-blur-sm"}`}
            onClick={() => setIsConfirmOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.3 }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card px-6 py-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden bg-background shadow-sm">
                <img src="/images/manna.jpg" alt="Manna" className="h-full w-full object-cover" />
              </div>
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={reduceMotion ? { duration: 0.2 } : { type: "spring", stiffness: 180, damping: 14 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <CheckCircle2 className="h-9 w-9 text-primary" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Order received!</h3>
                <p className="text-sm text-foreground/70">We will contact you shortly.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="mt-2 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isDeliveryOpen && (
        <div className="fixed inset-0 z-[9997] flex items-center justify-center px-4 py-6">
          <div
            className={`absolute inset-0 bg-black/40 ${isMobile ? "" : "backdrop-blur-sm"}`}
            onClick={() => setIsDeliveryOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card px-6 py-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delivery-title"
          >
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Quick Order</p>
              <h3 id="delivery-title" className="text-lg font-bold text-foreground">
                Delivery Method
              </h3>
              <p className="text-sm text-foreground/60">Choose how you want to receive your order.</p>
            </div>

            <div className="space-y-3">
              {deliveryOptions.map((option) => {
                const isSelected = option.value === orderForm.delivery

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setOrderForm({ ...orderForm, delivery: option.value })
                      setIsDeliveryOpen(false)
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-primary/60 bg-primary/10"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <span className="text-sm font-semibold text-foreground">{option.label}</span>
                    <span
                      className={`h-3 w-3 rounded-full border ${
                        isSelected ? "border-primary bg-primary" : "border-foreground/30"
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsDeliveryOpen(false)}
              className="mt-5 w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/60 transition"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Reservation Modal */}
      <ReservationModal isOpen={isReservationOpen} onClose={() => setIsReservationOpen(false)} />
    </>
  )
}
