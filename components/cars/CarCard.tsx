'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Fuel, Settings2, Gauge, Users, Calendar,
  Heart, MessageCircle, Eye, Star, Zap
} from 'lucide-react'
import { Car } from '@/types'
import {
  formatPrice, formatMileage, getFuelTypeColor,
  generateWhatsAppUrl, getOwnersLabel, calculateDiscount, DEALER_INFO
} from '@/lib/utils'

interface CarCardProps {
  car: Car
  index?: number
}

export default function CarCard({ car, index = 0 }: CarCardProps) {
  const [wishlist, setWishlist] = useState(false)
  const [imageError, setImageError] = useState(false)

  const primaryImage = car.images?.[0] || '/images/placeholder-car.jpg'
  const discount = car.original_price ? calculateDiscount(car.price, car.original_price) : null
  const whatsappUrl = generateWhatsAppUrl(DEALER_INFO.whatsapp, car)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/8 hover:border-gold-500/30 shadow-sm hover:shadow-2xl dark:hover:shadow-gold/10 transition-all duration-500"
      style={{ willChange: 'transform' }}
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={imageError ? '/images/placeholder-car.jpg' : primaryImage}
          alt={car.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {car.is_sold && (
            <span className="badge-sold text-xs font-bold px-3 py-1">SOLD</span>
          )}
          {car.is_featured && !car.is_sold && (
            <span className="badge-gold text-xs">
              <Star className="w-3 h-3" fill="currentColor" />
              Featured
            </span>
          )}
          {discount && !car.is_sold && (
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlist(!wishlist) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
            wishlist
              ? 'bg-red-500 text-white'
              : 'bg-white/20 text-white hover:bg-white/40'
          }`}
          aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="w-4 h-4" fill={wishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Image Count */}
        {car.images?.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <Eye className="w-3 h-3" />
            {car.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-gold-500 transition-colors duration-300">
              {car.title}
            </h3>
            {car.variant && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{car.variant}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-display font-bold text-gold-500 text-lg leading-none">
              {formatPrice(car.price)}
            </div>
            {car.original_price && (
              <div className="text-xs text-gray-400 line-through mt-0.5">
                {formatPrice(car.original_price)}
              </div>
            )}
          </div>
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {car.year && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5 text-gold-500" />
              <span>{car.year}</span>
            </div>
          )}
          {car.mileage !== null && car.mileage !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Gauge className="w-3.5 h-3.5 text-gold-500" />
              <span>{formatMileage(car.mileage)}</span>
            </div>
          )}
          {car.fuel_type && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Fuel className="w-3.5 h-3.5 text-gold-500" />
              <span>{car.fuel_type}</span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Settings2 className="w-3.5 h-3.5 text-gold-500" />
              <span>{car.transmission}</span>
            </div>
          )}
          {car.owners && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Users className="w-3.5 h-3.5 text-gold-500" />
              <span>{getOwnersLabel(car.owners)}</span>
            </div>
          )}
          {car.registration_state && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Zap className="w-3.5 h-3.5 text-gold-500" />
              <span>{car.registration_state} Reg.</span>
            </div>
          )}
        </div>

        {/* Fuel Type Badge */}
        {car.fuel_type && (
          <div className="mb-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getFuelTypeColor(car.fuel_type)}`}>
              {car.fuel_type}
            </span>
          </div>
        )}

        {/* CTAs */}
        <div className="flex gap-2">
          <Link
            href={`/car/${car.slug || car.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-600 dark:text-gold-400 text-sm font-semibold transition-all duration-200 border border-gold-500/20 hover:border-gold-500/40"
          >
            View Details
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#25d366] text-sm font-semibold transition-all duration-200 border border-[#25d366]/20 hover:border-[#25d366]/40"
            aria-label="Inquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
