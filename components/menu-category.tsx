"use client"

import { motion } from "framer-motion"

interface MenuItem {
  name: string
  price: string
}

interface MenuCategoryProps {
  data: {
    title: string
    color: string
    items: MenuItem[]
  }
  index: number
}

export default function MenuCategory({ data, index }: MenuCategoryProps) {
  const isDark = data.color === "bg-primary"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <div className="mb-6">
        <div className="inline-block bg-accent px-6 py-3 rounded-lg">
          <h3 className="text-xl font-bold uppercase tracking-wide text-primary">{data.title}</h3>
        </div>
      </div>

      <div className="space-y-4">
        {data.items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + idx * 0.05 }}
            className="flex justify-between items-baseline gap-4 pb-2 border-b border-border/50 hover:border-primary/30 transition"
          >
            <span className="text-foreground">{item.name}</span>
            <span className="font-semibold text-primary whitespace-nowrap">{item.price}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
