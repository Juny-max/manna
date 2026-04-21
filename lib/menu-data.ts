export interface MenuItem {
  name: string
  price: string
}

export interface MenuCategoryData {
  title: string
  color: string
  items: MenuItem[]
}

export interface MenuPage {
  id: string
  title: string
  items: MenuItem[]
  tone: "brown" | "dark"
}

const resolveTone = (color: string): "brown" | "dark" => (color === "bg-primary" ? "dark" : "brown")

export const menuData: Record<string, MenuCategoryData> = {
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
      { name: "Gari fɔtɔ", price: "GHS 30.00" },
      { name: "Banku", price: "GHS 10.00" },
      { name: "Jollof", price: "GHS 35.00" },
      { name: "Manna Rice", price: "GHS 35.00" },
      { name: "Noodles", price: "GHS 35.00" },
      { name: "Pasta Bake", price: "GHS 60.00" },
      { name: "Waakye", price: "GHS 35.00" },
      { name: "White Rice", price: "GHS 30.00" },
      { name: "Yam/Plantain", price: "GHS 25.00" },
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
      { name: "Beans Stew", price: "GHS 30.00" },
      { name: "Curry Chicken", price: "GHS 40.00" },
      { name: "Garden Egg Stew", price: "GHS 40.00" },
      { name: "Palava Sauce", price: "GHS 40.00" },
      { name: "Tomato Gravy", price: "GHS 25.00" },
      { name: "Waakye Stew", price: "GHS 25.00" },
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

export const menuPages: MenuPage[] = [
  {
    id: "smallChops",
    title: menuData.smallChops.title,
    items: menuData.smallChops.items,
    tone: resolveTone(menuData.smallChops.color),
  },
  {
    id: "carbs",
    title: menuData.carbs.title,
    items: menuData.carbs.items,
    tone: resolveTone(menuData.carbs.color),
  },
  {
    id: "proteins",
    title: menuData.proteins.title,
    items: menuData.proteins.items,
    tone: resolveTone(menuData.proteins.color),
  },
  {
    id: "sauces",
    title: menuData.sauces.title,
    items: menuData.sauces.items,
    tone: resolveTone(menuData.sauces.color),
  },
  {
    id: "veggies",
    title: menuData.veggies.title,
    items: menuData.veggies.items,
    tone: resolveTone(menuData.veggies.color),
  },
  {
    id: "drinks",
    title: menuData.drinks.title,
    items: menuData.drinks.items,
    tone: resolveTone(menuData.drinks.color),
  },
]
