"use client"

import { motion } from "framer-motion"
import MenuCategory from "./menu-category"
import { menuData } from "@/lib/menu-data"

export default function MenuSection() {
  return (
    <section id="menu" className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Menu</h2>
          <p className="text-lg text-foreground/70">Mix and match to create your perfect meal</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {Object.entries(menuData).map((item, index) => (
            <MenuCategory key={item[0]} data={item[1]} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-card rounded-xl border border-border text-sm text-foreground/70"
        >
          <p className="font-semibold mb-2">Disclaimer:</p>
          <p>
            Please be aware that our food may contain or come into contact with common allergens, such as dairy, eggs,
            wheat, soybeans, nuts, fish, shellfish or tree nuts.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
