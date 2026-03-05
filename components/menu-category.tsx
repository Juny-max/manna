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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      aria-label={data.title}
    >
      <header className="mb-6">
        <h3 className={`category-title ${isDark ? "title-dark" : "title-brown"}`}>{data.title}</h3>
      </header>

      <div className="space-y-4">
        {data.items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + idx * 0.05 }}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 pb-2 px-2 sm:px-0 border-b border-border/50 hover:border-primary/30 transition"
          >
            <span className="min-w-0 text-foreground">{item.name}</span>
            <span className="font-semibold text-primary whitespace-nowrap text-right">{item.price}</span>
          </motion.div>
        ))}
      </div>
    </motion.article>
  )
}
