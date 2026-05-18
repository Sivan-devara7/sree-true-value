'use client'

import { motion } from 'framer-motion'
import { Car, CheckCircle2, TrendingUp, Users } from 'lucide-react'

interface StatsProps {
  stats: {
    total: number
    sold: number
    available: number
  }
}

const FIXED_STATS = [
  { label: 'Happy Customers', value: '2,500+', icon: Users, suffix: '' },
  { label: 'Certified Quality', value: '100%', icon: CheckCircle2, suffix: '' },
]

export default function StatsSection({ stats }: StatsProps) {
  return (
    <section className="py-16 bg-gray-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Dynamic Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-dark rounded-2xl p-6 text-center border border-gold-500/10"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center mx-auto mb-3">
              <Car className="w-5 h-5 text-gold-500" />
            </div>
            <div className="stat-number mb-1">{stats.available}+</div>
            <div className="text-sm text-gray-400 font-medium">Cars Available</div>
            <div className="text-xs text-gray-600 mt-1">{stats.sold} sold to happy owners</div>
          </motion.div>

          {FIXED_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
              className="glass-dark rounded-2xl p-6 text-center border border-white/5"
            >
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-gold-500" />
              </div>
              <div className="stat-number mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
