'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Car, Menu, X, Sun, Moon, Phone, Search,
  ChevronRight
} from 'lucide-react'
import { DEALER_INFO, generateCallUrl } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isHome = pathname === '/'

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? 'bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-lg border-b border-black/5 dark:border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-black">
                  <img src="/images/logo.jpg" alt="Sree True Value" className="w-full h-full object-contain" />
                </div>
                <div className="absolute inset-0 rounded-xl gold-gradient opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
              </div>
              <div>
                <div className={`font-display font-bold text-lg leading-none transition-colors duration-300 ${
                  scrolled || !isHome ? 'text-gray-900 dark:text-white' : 'text-white'
                }`}>
                  Sree{' '}
                  <span className="text-gradient-gold">True Value</span>
                </div>
                <div className={`text-xs font-medium leading-none mt-0.5 transition-colors duration-300 ${
                  scrolled || !isHome ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300'
                }`}>
                  Kakinada
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium text-sm transition-colors duration-300 group ${
                    pathname === link.href
                      ? 'text-gold-500'
                      : scrolled || !isHome
                        ? 'text-gray-700 dark:text-gray-300 hover:text-gold-500 dark:hover:text-gold-400'
                        : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 gold-gradient transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    scrolled || !isHome
                      ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                </button>
              )}

              {/* Search */}
              <Link
                href="/inventory"
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  scrolled || !isHome
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Search className="w-4.5 h-4.5" />
              </Link>

              {/* Call Button */}
              <a
                href={generateCallUrl(DEALER_INFO.phone)}
                className="btn-primary text-xs px-4 py-2.5"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Now
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`p-2 rounded-lg transition-colors ${
                    scrolled || !isHome
                      ? 'text-gray-600 dark:text-gray-300'
                      : 'text-gray-300'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  scrolled || !isHome
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-white'
                }`}
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 lg:hidden shadow-2xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-gold-500/10 text-gold-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}
              <div className="pt-2 pb-1">
                <a
                  href={generateCallUrl(DEALER_INFO.phone)}
                  className="btn-primary w-full justify-center"
                >
                  <Phone className="w-4 h-4" />
                  {DEALER_INFO.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
