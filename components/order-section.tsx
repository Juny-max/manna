"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Clock, Phone } from "lucide-react"
import ReservationModal from "./reservation-modal"
import DeliveryPartners from "./delivery-partners"

export default function OrderSection() {
  const [activeTab, setActiveTab] = useState<"order" | "delivery">("order")
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", items: "", delivery: "pickup" })

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Order:", orderForm)
    alert("Order received! We will contact you shortly.")
    setOrderForm({ name: "", phone: "", items: "", delivery: "pickup" })
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
              transition={{ duration: 0.5 }}
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
                  onSubmit={handleOrderSubmit}
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
                    <textarea
                      required
                      value={orderForm.items}
                      onChange={(e) => setOrderForm({ ...orderForm, items: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      placeholder="e.g., 2x Beef Pattie, 1x Jollof Rice with Peppered Goat..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Delivery Method</label>
                    <select
                      value={orderForm.delivery}
                      onChange={(e) => setOrderForm({ ...orderForm, delivery: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Visit Us</h2>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 8 }}
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
                  whileHover={{ x: 8 }}
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
                  whileHover={{ x: 8 }}
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsReservationOpen(true)}
                className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Reserve Table
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reservation Modal */}
      <ReservationModal isOpen={isReservationOpen} onClose={() => setIsReservationOpen(false)} />
    </>
  )
}
