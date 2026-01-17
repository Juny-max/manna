"use client"

import { motion } from "framer-motion"
import MenuCategory from "./menu-category"

const menuData = {
  smallChops: {
    title: "Small Chops",
    color: "bg-accent",
    items: [
      { name: "Beef Pattie", price: "GHS 30.00" },
      { name: "Beef Samosas", price: "GHS 10.00" },
      { name: "Chicken/Beef Spring rolls", price: "GHS 10.00" },
      { name: "Chicken Wings", price: "GHS 15.00" },
      { name: "Sambousek (Lebanese Meat Pie)", price: "GHS 15.00" },
      { name: "Sausage Rolls", price: "GHS 30.00" },
      { name: "Scotch Egg", price: "GHS 30.00" },
      { name: "Seafood Mix", price: "GHS 65.00" },
      { name: "Yam Balls", price: "GHS 20.00" },
    ],
  },
  carbs: {
    title: "Carbs",
    color: "bg-accent",
    items: [
      { name: "Gari Fote", price: "GHS 30.00" },
      { name: "Banku**", price: "GHS 10.00" },
      { name: "Jollof", price: "GHS 35.00" },
      { name: "Manna Rice", price: "GHS 35.00" },
      { name: "Noodles", price: "GHS 35.00" },
      { name: "Pasta Bake", price: "GHS 60.00" },
      { name: "Waakye**", price: "GHS 35.00" },
      { name: "White Rice", price: "GHS 30.00" },
      { name: "Yam/Plantain**", price: "GHS 25.00" },
    ],
  },
  proteins: {
    title: "Proteins",
    color: "bg-primary",
    items: [
      { name: "Chicken", price: "GHS 35.00" },
      { name: "Fried Fish", price: "GHS 40.00" },
      { name: "Norwegian Salmon Fillet", price: "GHS 140.00" },
      { name: "Peppered Goat", price: "GHS 80.00" },
    ],
  },
  sauces: {
    title: "Sauces / Stews",
    color: "bg-primary",
    items: [
      { name: "Beef Sauce", price: "GHS 40.00" },
      { name: "Beans Stew**", price: "GHS 30.00" },
      { name: "Curry Chicken", price: "GHS 40.00" },
      { name: "Garden Egg Stew**", price: "GHS 40.00" },
      { name: "Palava Sauce", price: "GHS 40.00" },
      { name: "Tomato Gravy", price: "GHS 25.00" },
      { name: "Waakye Stew**", price: "GHS 25.00" },
      { name: "Meat", price: "GHS 20.00" },
      { name: "Beef", price: "GHS 20.00" },
      { name: "Egg", price: "GHS 5.00" },
      { name: "Wele", price: "GHS 10.00" },
    ],
  },
  veggies: {
    title: "Veggies",
    color: "bg-accent",
    items: [
      { name: "Coleslaw/Dry Salad", price: "GHS 10.00" },
      { name: "Sautéed Vegetables", price: "GHS 25.00" },
      { name: "Stewed Vegetables", price: "GHS 30.00" },
    ],
  },
  drinks: {
    title: "Drinks",
    color: "bg-secondary",
    items: [
      { name: "Manna Juice", price: "GHS 25.00" },
      { name: "Sugarcane Lime Ginger", price: "GHS 20.00" },
      { name: "Sobolo", price: "GHS 20.00" },
      { name: "Pineapple", price: "GHS 20.00" },
      { name: "Coke", price: "GHS 10.00" },
      { name: "Sprite", price: "GHS 10.00" },
      { name: "Water", price: "GHS 5.00" },
    ],
  },
}

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
