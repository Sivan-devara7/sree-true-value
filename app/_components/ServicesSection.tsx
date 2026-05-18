'use client'

import { motion } from 'framer-motion'
import {
  ShieldCheck, Wrench, CreditCard, RotateCcw,
  FileText, HeartHandshake
} from 'lucide-react'

const SERVICES = [
  {
    icon: ShieldCheck,
    title: '100+ Point Inspection',
    description: 'Every vehicle undergoes rigorous multi-point quality inspection before listing.',
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-400',
  },
  {
    icon: FileText,
    title: 'Clear Documentation',
    description: 'Full service history, original RC, insurance papers — everything transparent.',
    color: 'from-green-500/20 to-green-500/5',
    iconColor: 'text-green-400',
  },
  {
    icon: CreditCard,
    title: 'Easy Financing',
    description: 'Get loans at competitive rates from leading banks. Fast approval in 24 hours.',
    color: 'from-gold-500/20 to-gold-500/5',
    iconColor: 'text-gold-400',
  },
  {
    icon: RotateCcw,
    title: 'Exchange & Upgrade',
    description: 'Trade in your old vehicle and upgrade to something better at great value.',
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-400',
  },
  {
    icon: Wrench,
    title: 'Free Service Check',
    description: 'Get a complimentary basic service check with every purchase.',
    color: 'from-orange-500/20 to-orange-500/5',
    iconColor: 'text-orange-400',
  },
  {
    icon: HeartHandshake,
    title: 'After-Sale Support',
    description: 'Our relationship doesn\'t end at purchase. We\'re here for all your needs.',
    color: 'from-red-500/20 to-red-500/5',
    iconColor: 'text-red-400',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider block mb-2">
            Why Choose Us
          </span>
          <h2 className="section-title text-gray-900 dark:text-white">
            The <span className="text-gradient-gold">Sree True Value</span> Difference
          </h2>
          <p className="section-subtitle mt-3 max-w-2xl mx-auto">
            We go beyond just selling cars. Every step of your journey with us is crafted
            to be seamless, transparent, and truly valuable.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-white/8 hover:border-gold-500/20 shadow-sm hover:shadow-lg dark:hover:shadow-gold/5 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-6 h-6 ${service.iconColor}`} />
              </div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
