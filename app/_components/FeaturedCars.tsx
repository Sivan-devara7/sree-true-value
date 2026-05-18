'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Car } from '@/types'
import CarCard from '@/components/cars/CarCard'

interface FeaturedCarsProps {
  cars: Car[]
}

export default function FeaturedCars({ cars }: FeaturedCarsProps) {
  if (cars.length === 0) return null

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider">Handpicked for You</span>
            </div>
            <h2 className="section-title text-gray-900 dark:text-white">
              Featured <span className="text-gradient-gold">Vehicles</span>
            </h2>
            <p className="section-subtitle mt-2">
              Our top picks — certified, inspected, and ready to drive
            </p>
          </div>
          <Link
            href="/inventory?featured=true"
            className="btn-secondary flex-shrink-0 text-sm"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/inventory" className="btn-primary">
            Browse Complete Inventory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
