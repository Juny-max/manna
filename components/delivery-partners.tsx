"use client"

import { motion } from "framer-motion"

export default function DeliveryPartners() {
  const partners = [
    {
      name: "Bolt Food",
      logo: "/images/bolt-20food-20logo.jpg",
      url: "#",
    },
    {
      name: "Glovo",
      logo: "/images/glovo.jpg",
      url: "#",
    },
    {
      name: "Uber Eats",
      logo: "/images/uber-20eats.jpg",
      url: "#",
    },
  ]

  return (
    <div className="bg-accent/10 p-6 rounded-xl border border-accent/20">
      <h3 className="font-semibold text-foreground mb-4">Also Available On</h3>
      <div className="grid grid-cols-3 gap-4">
        {partners.map((partner, idx) => (
          <motion.a
            key={idx}
            href={partner.url}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition"
          >
            <img src={partner.logo || "/placeholder.svg"} alt={partner.name} className="h-10 w-auto object-contain" />
          </motion.a>
        ))}
      </div>
    </div>
  )
}
