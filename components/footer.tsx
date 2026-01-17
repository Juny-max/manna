"use client"

import { Instagram, Facebook, Twitter, MapPin, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/manna.jpg" alt="MANNA Logo" className="w-8 h-8 invert" />
              <span className="text-xl font-bold">MANNA</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">Authentic Ghanaian food, quick service, great value.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#menu" className="hover:text-primary-foreground transition">
                  Menu
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary-foreground transition">
                  About
                </a>
              </li>
              <li>
                <a href="#order" className="hover:text-primary-foreground transition">
                  Order
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-primary-foreground transition">
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Clock size={18} /> Hours
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Mon-Fri: 11 AM - 7 PM</li>
              <li>Saturday: 11 AM - 5 PM</li>
              <li>Sunday: 1 PM - 5 PM</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin size={18} /> Location
            </h4>
            <p className="text-sm text-primary-foreground/80 mb-4">Accra, Ghana</p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/eatmannagh"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground/80 transition"
              >
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-foreground/80 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-foreground/80 transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/70">
          <p>&copy; 2026 MANNA. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-foreground transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-foreground transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
