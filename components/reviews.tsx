"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "Nii Dzani",
    rating: 5,
    text: "I was super skeptical when I saw this place pop up but boy was I wrong. Do yourself and your tastebuds a favor and just go there! They are really on to something here. Quality food (restaurant level) actually well seasoned.",
    highlight: "Quality food",
  },
  {
    name: "Akua Konama",
    rating: 5,
    text: "The atmosphere was nice though small. Reasonable food prices depending on what you select. I loved their peppered goat meat and rice dishes.",
    highlight: "Great value",
  },
  {
    name: "David Deteah",
    rating: 5,
    text: "Good food and very good customer service. Beef sauce, yam balls and manna rice were favored.",
    highlight: "Excellent service",
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Customers Say</h2>
          <p className="text-lg text-foreground/70">Real reviews from real customers who love MANNA</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-card p-6 md:p-8 rounded-xl border border-border hover:border-accent/30 transition shadow-sm hover:shadow-lg"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                className="flex gap-1 mb-4"
              >
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </motion.div>
              <p className="text-foreground/80 mb-6 text-sm md:text-base leading-relaxed">{review.text}</p>
              <div>
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-sm text-accent font-medium">{review.highlight}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
