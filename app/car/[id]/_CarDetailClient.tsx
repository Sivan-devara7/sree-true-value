'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Phone, MessageCircle, Share2,
  Calendar, Gauge, Fuel, Settings2, Users, Palette, MapPin,
  Shield, CheckCircle2, Star, AlertCircle
} from 'lucide-react'
import { Car } from '@/types'
import CarCard from '@/components/cars/CarCard'
import EMICalculator from '@/components/cars/EMICalculator'
import {
  formatPrice, formatPriceExact, formatMileage, getOwnersLabel,
  generateWhatsAppUrl, generateCallUrl, calculateDiscount, getCarAge,
  DEALER_INFO
} from '@/lib/utils'

interface Props {
  car: Car
  relatedCars: Car[]
}

export default function CarDetailClient({ car, relatedCars }: Props) {
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)

  const images = car.images?.length > 0 ? car.images : ['/images/placeholder-car.jpg']
  const discount = car.original_price ? calculateDiscount(car.price, car.original_price) : null
  const whatsappUrl = generateWhatsAppUrl(DEALER_INFO.whatsapp, car)

  const handleShare = async () => {
    try {
      await navigator.share({ title: car.title, url: window.location.href })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const SPECS = [
    { icon: Calendar, label: 'Year', value: car.year?.toString() },
    { icon: Gauge, label: 'Mileage', value: car.mileage != null ? formatMileage(car.mileage) : null },
    { icon: Fuel, label: 'Fuel Type', value: car.fuel_type },
    { icon: Settings2, label: 'Transmission', value: car.transmission },
    { icon: Users, label: 'Ownership', value: car.owners ? getOwnersLabel(car.owners) : null },
    { icon: Palette, label: 'Color', value: car.color },
    { icon: MapPin, label: 'Reg. State', value: car.registration_state },
    { icon: Star, label: 'Body Type', value: car.body_type },
  ].filter((s) => s.value)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/inventory" className="hover:text-gold-500 transition-colors">Inventory</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-400 line-clamp-1">{car.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/8"
            >
              {/* Main Image */}
              <div className="relative aspect-[16/10] bg-gray-100 dark:bg-gray-800">
                <Image
                  src={images[activeImage]}
                  alt={`${car.title} - Image ${activeImage + 1}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {car.is_sold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-red-500 text-white font-display font-black text-3xl px-8 py-3 rounded-2xl -rotate-6">
                      SOLD
                    </div>
                  </div>
                )}
                {/* Nav Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((a) => (a - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage((a) => (a + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                  {activeImage + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto hide-scrollbar">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-gold-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-white/8"
            >
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-5">
                Vehicle Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {SPECS.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-gold-500" />
                    </div>
                    <div className="text-xs text-gray-500">{label}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            {car.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-white/8"
              >
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-3">
                  About This Car
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {car.description}
                </p>
              </motion.div>
            )}

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-white/8"
              >
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">
                  Features & Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {car.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Price + CTA + EMI */}
          <div className="space-y-5">
            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-white/8 sticky top-24"
            >
              {/* Title */}
              <h1 className="font-display font-black text-2xl text-gray-900 dark:text-white leading-tight mb-1">
                {car.title}
              </h1>
              {car.variant && (
                <p className="text-sm text-gray-400 mb-4">{car.variant}</p>
              )}

              {/* Price */}
              <div className="flex items-end gap-3 mb-2">
                <div className="font-display font-black text-3xl text-gold-500">
                  {formatPrice(car.price)}
                </div>
                {car.original_price && (
                  <div className="text-base text-gray-400 line-through pb-0.5">
                    {formatPrice(car.original_price)}
                  </div>
                )}
              </div>
              {discount && (
                <div className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 text-xs font-bold px-2.5 py-1 rounded-full mb-4">
                  You save {formatPriceExact(car.original_price! - car.price)} ({discount}% off)
                </div>
              )}

              <div className="text-xs text-gray-400 mb-5">
                {formatPriceExact(car.price)} · All taxes and fees extra · {getCarAge(car.year)} old
              </div>

              {/* CTA Buttons */}
              {!car.is_sold ? (
                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-[#25d366] hover:bg-[#20b859] text-white transition-all duration-300 shadow-lg shadow-green-500/20"
                  >
                    <MessageCircle className="w-4.5 h-4.5" />
                    Inquire on WhatsApp
                  </a>
                  <a
                    href={generateCallUrl(DEALER_INFO.phone)}
                    className="btn-primary w-full justify-center"
                  >
                    <Phone className="w-4.5 h-4.5" />
                    Call {DEALER_INFO.phone}
                  </a>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gold-500/40 hover:text-gold-500 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    {copied ? 'Link Copied!' : 'Share This Car'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-500/20">
                  <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 dark:text-red-400 font-semibold text-sm">This vehicle has been sold</p>
                  <p className="text-gray-500 text-xs mt-1">Browse our other available cars</p>
                  <Link href="/inventory" className="mt-3 btn-secondary text-xs inline-flex">
                    View Inventory
                  </Link>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/8 space-y-2">
                {[
                  { icon: Shield, text: 'Certified Pre-Owned Vehicle' },
                  { icon: CheckCircle2, text: 'Clear Title & Documentation' },
                  { icon: Star, text: 'Quality Inspected' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                    <Icon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* EMI Calculator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <EMICalculator carPrice={car.price} />
            </motion.div>
          </div>
        </div>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCars.map((relCar, i) => (
                <CarCard key={relCar.id} car={relCar} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}
