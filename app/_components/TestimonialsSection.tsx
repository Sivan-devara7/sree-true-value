'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Ravi Kumar',
    location: 'Kakinada',
    rating: 5,
    text: 'Bought a Hyundai Creta from Sree True Value. The whole process was smooth — they helped with finance, insurance everything. The car was exactly as described. Highly recommend!',
    car: '2020 Hyundai Creta SX',
  },
  {
    name: 'Priya Lakshmi',
    location: 'Rajahmundry',
    rating: 5,
    text: 'Excellent service! The team was very honest about the car\'s condition. No hidden surprises after purchase. Got a great Swift at a fair price. Will definitely come back for my next car.',
    car: '2021 Maruti Swift VXI',
  },
  {
    name: 'Suresh Babu',
    location: 'Kakinada',
    rating: 5,
    text: 'The inspection report they provided gave me complete confidence. Staff is very knowledgeable and patient. Got good exchange value for my old car. 10/10 experience.',
    car: '2019 Honda City ZX',
  },
  {
    name: 'Anitha Reddy',
    location: 'Amalapuram',
    rating: 5,
    text: 'Professional team, transparent pricing, and great after-sale support. The car has been running perfectly for 6 months. Thank you Sree True Value!',
    car: '2020 Tata Nexon XZ',
  },
  {
    name: 'Venkat Rao',
    location: 'Kakinada',
    rating: 5,
    text: 'Best used car buying experience I\'ve had. They arranged home delivery and handled all the RTO paperwork. The Kia Seltos was in immaculate condition.',
    car: '2021 Kia Seltos HTX',
  },
  {
    name: 'Meera Devi',
    location: 'Peddapuram',
    rating: 5,
    text: 'Very trustworthy dealership. They showed me multiple cars in my budget and never pushed me. Found my perfect Honda Amaze with single owner and low mileage!',
    car: '2020 Honda Amaze V CVT',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider block mb-2">
            Customer Stories
          </span>
          <h2 className="section-title text-gray-900 dark:text-white">
            What Our <span className="text-gradient-gold">Customers</span> Say
          </h2>
          <p className="section-subtitle mt-3 max-w-2xl mx-auto">
            Don't just take our word for it — hear from the hundreds of happy customers
            who found their perfect car at Sree True Value.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-white/8 hover:border-gold-500/20 hover:shadow-lg transition-all duration-300 group relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10 text-gold-500" fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold-500" fill="currentColor" />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{testimonial.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-gold-500 bg-gold-500/10 px-2.5 py-1 rounded-full">
                    {testimonial.car}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
