import Link from 'next/link'
import { Car, Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube } from 'lucide-react'
import { DEALER_INFO, generateCallUrl } from '@/lib/utils'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-black">
                <img src="/images/logo.jpg" alt="Sree True Value" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-none">
                  Sree <span className="text-gradient-gold">True Value</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Kakinada, AP</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Kakinada's most trusted used car dealership. Premium pre-owned vehicles with
              transparent pricing, certified quality, and hassle-free buying experience.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold-500/20 hover:text-gold-400 flex items-center justify-center transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold-500/20 hover:text-gold-400 flex items-center justify-center transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold-500/20 hover:text-gold-400 flex items-center justify-center transition-all duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/inventory', label: 'Browse Inventory' },
                { href: '/inventory?featured=true', label: 'Featured Cars' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/admin/login', label: 'Admin Login' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-gold-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Makes */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Browse by Make</h3>
            <ul className="space-y-2.5">
              {['Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra', 'Kia', 'MG'].map((make) => (
                <li key={make}>
                  <Link
                    href={`/inventory?make=${encodeURIComponent(make)}`}
                    className="text-sm hover:text-gold-400 transition-colors duration-200"
                  >
                    {make}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Get In Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{DEALER_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <a
                  href={generateCallUrl(DEALER_INFO.phone)}
                  className="text-sm hover:text-gold-400 transition-colors"
                >
                  {DEALER_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <a
                  href={`mailto:${DEALER_INFO.email}`}
                  className="text-sm hover:text-gold-400 transition-colors"
                >
                  {DEALER_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div>{DEALER_INFO.hours}</div>
                  <div className="text-gray-500">{DEALER_INFO.sunday}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {currentYear} Sree True Value. All rights reserved. Kakinada, Andhra Pradesh.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
