import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const getMetadataBase = () => {
  const primary = process.env.NEXT_PUBLIC_SITE_URL
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
  const fallback = "http://localhost:3000"
  const selected = primary ?? vercel ?? fallback

  try {
    return new URL(selected)
  } catch {
    return new URL(fallback)
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "MANNA | Authentic Ghanaian Cuisine in Accra",
  description:
    "Experience authentic Ghanaian food at MANNA. Quality meals, quick service, and the perfect mix-and-match dining experience in the heart of Accra.",
  keywords: "Ghanaian food, restaurant, Accra, small chops, carbs, protein",
  openGraph: {
    title: "MANNA | Authentic Ghanaian Cuisine",
    description: "Quality food, quick service, local favorite",
    type: "website",
    images: ["/images/manna.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MANNA | Authentic Ghanaian Cuisine",
    description: "Experience authentic Ghanaian food at MANNA in Accra",
    images: ["/images/manna.jpg"],
  },
  icons: {
    icon: "/images/manna.jpg",
    shortcut: "/images/manna.jpg",
  },
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
