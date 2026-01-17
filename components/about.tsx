"use client"

import { motion } from "framer-motion"
import { Award, Zap, Palette, TrendingUp } from "lucide-react"

export default function About() {
  const features = [
    {
      icon: Award,
      title: "Quality Food",
      description:
        "Restaurant-level quality with authentic Ghanaian flavors, prepared with care and the finest ingredients.",
    },
    {
      icon: Zap,
      title: "Quick Service",
      description:
        "Get your meal fast without compromising on taste or quality. Perfect for lunch breaks or quick dinners.",
    },
    {
      icon: Palette,
      title: "Mix & Match",
      description:
        "Create your perfect meal by mixing different carbs, proteins, sauces, and sides to match your taste.",
    },
    {
      icon: TrendingUp,
      title: "Great Value",
      description: "Affordable prices that don't sacrifice quality. Quality food at prices that make sense.",
    },
  ]

  return (
    <section id="about" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-lg bg-foreground/5"
          >
            <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video1-oPDeeQtrvF0sYZixOCNSDDUNEkAlXf.mp4" autoPlay muted loop className="w-full h-auto" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm font-medium text-accent tracking-widest uppercase mb-2">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose MANNA?</h2>
            </div>

            <div className="space-y-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-shrink-0">
                      <Icon size={24} className="text-primary mt-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-foreground/70 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4 flex gap-4"
            >
              <a
                href="https://www.instagram.com/eatmannagh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent/10 text-accent px-6 py-3 rounded-lg hover:bg-accent/20 transition font-medium"
              >
                Follow on Instagram
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
