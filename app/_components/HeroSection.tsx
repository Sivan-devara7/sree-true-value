'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ChevronDown, Star, Shield, ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-950">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

        {/* Gold accent glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(200,168,75,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,0.8) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">


        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white leading-none mb-6"
        >
          Find Your{' '}
          <span className="text-gradient-gold block sm:inline">Perfect</span>{' '}
          <br className="hidden sm:block" />
          Drive
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
        >
          Premium pre-owned vehicles with certified quality, transparent pricing, and a
          buying experience like no other. Your dream car awaits.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="glass-dark rounded-2xl p-2 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <Link
                href="/inventory"
                className="w-full py-3 text-left text-gray-400 text-sm"
              >
                Search by make, model, or budget...
              </Link>
            </div>
            <Link
              href="/inventory"
              className="btn-primary flex-shrink-0 text-sm"
            >
              Browse All Cars
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Quick Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { label: 'Under ₹5 Lakh', href: '/inventory?max_price=500000' },
            { label: 'Automatic Cars', href: '/inventory?transmission=Automatic' },
            { label: 'SUVs', href: '/inventory?body_type=SUV' },
            { label: 'Electric / CNG', href: '/inventory?fuel_type=Electric' },
            { label: 'Featured Picks', href: '/inventory?featured=true' },
          ].map((filter) => (
            <Link
              key={filter.href}
              href={filter.href}
              className="px-4 py-2 rounded-full glass-dark text-xs font-medium text-gray-300 hover:text-gold-400 hover:border-gold-500/40 border border-white/10 transition-all duration-200"
            >
              {filter.label}
            </Link>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600 font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
