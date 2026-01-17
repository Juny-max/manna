"use client"

import { motion } from "framer-motion"

const foodItems = [
  {
    name: "Jollof & Plantain",
    image: "/images/jollof-20and-20plantain.jpg",
    description: "Golden plantain and aromatic jollof rice",
    size: "large",
  },
  {
    name: "Beef Samosa",
    image: "/images/beef-20samosa.jpg",
    description: "Crispy fried samosa",
    size: "small",
  },
  {
    name: "Sausage Rolls",
    image: "/images/beef-20sausage-20rolls-20recipe-20-%20-20bascooking.jpg",
    description: "Golden pastry sausage rolls",
    size: "medium",
  },
  {
    name: "Pigs in a Blanket",
    image: "/images/pigs-20in-20a-20blanket.jpg",
    description: "Sausages wrapped in pastry",
    size: "medium",
  },
  {
    name: "Gari Foto",
    image: "/images/gari-20foto.jpg",
    description: "Savory gari foto",
    size: "large",
  },
  {
    name: "Beef Pattie",
    image: "/images/beef-20pattie.jpg",
    description: "Juicy grilled beef",
    size: "medium",
  },
  {
    name: "Cajun Seafood Boil",
    image: "/images/cajun-20seafood-20boil-20-%20-20foxy-20folksy.jpg",
    description: "Fresh seafood mix",
    size: "large",
  },
  {
    name: "Crispy Chicken Wings",
    image: "/images/crispy-20old-20bay-20chicken-20wings.jpg",
    description: "Golden crispy wings",
    size: "medium",
  },
  {
    name: "African Delicacy",
    image: "/images/african-20delicacy.jpg",
    description: "Grilled fish with sauce",
    size: "medium",
  },
  {
    name: "Chicken Cheese Balls",
    image: "/images/chicken-20cheese-20balls-20recipe-20-%20-20fun-20food-20frolic.jpg",
    description: "Crispy cheese balls",
    size: "small",
  },
]

export default function FoodGallery() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Food Gallery</h2>
          <p className="text-lg text-foreground/70">Explore our delicious authentic Ghanaian cuisine</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
          {foodItems.map((item, idx) => {
            let colSpan = "col-span-1"
            let rowSpan = "row-span-1"

            if (item.size === "large") {
              colSpan = "col-span-2"
              rowSpan = "row-span-2"
            } else if (item.size === "medium") {
              colSpan = "col-span-1"
              rowSpan = "row-span-1"
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`${colSpan} ${rowSpan} group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer`}
              >
                <img
                  src={item.image || "/placeholder.svg?height=250&width=250&query=food"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 text-white"
                >
                  <h3 className="font-bold text-lg text-balance leading-tight">{item.name}</h3>
                  <p className="text-sm text-white/80 line-clamp-2">{item.description}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
