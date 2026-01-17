import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MANNA | Authentic Ghanaian Cuisine in Accra",
  description:
    "Experience authentic Ghanaian food at MANNA. Quality meals, quick service, and the perfect mix-and-match dining experience in the heart of Accra.",
  keywords: "Ghanaian food, restaurant, Accra, small chops, carbs, protein",
  openGraph: {
    title: "MANNA | Authentic Ghanaian Cuisine",
    description: "Quality food, quick service, local favorite",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-background`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
