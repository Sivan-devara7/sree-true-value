'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Car, TrendingUp, Star, MessageSquare, Plus, CheckCircle,
  Clock, Phone, XCircle
} from 'lucide-react'
import { Car as CarType, Inquiry } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

interface DashboardData {
  stats: {
    totalCars: number
    soldCars: number
    availableCars: number
    featuredCars: number
    newInquiries: number
  }
  recentCars: CarType[]
  recentInquiries: Inquiry[]
}

interface Props {
  data: DashboardData
}

const STAT_CARDS = (stats: DashboardData['stats']) => [
  {
    label: 'Total Listings',
    value: stats.totalCars,
    icon: Car,
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-400',
    href: '/admin/cars',
  },
  {
    label: 'Available',
    value: stats.availableCars,
    icon: CheckCircle,
    color: 'from-green-500/20 to-green-500/5',
    iconColor: 'text-green-400',
    href: '/admin/cars',
  },
  {
    label: 'Sold',
    value: stats.soldCars,
    icon: TrendingUp,
    color: 'from-gold-500/20 to-gold-500/5',
    iconColor: 'text-gold-400',
    href: '/admin/cars',
  },
  {
    label: 'Featured',
    value: stats.featuredCars,
    icon: Star,
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-400',
    href: '/admin/cars',
  },
  {
    label: 'New Inquiries',
    value: stats.newInquiries,
    icon: MessageSquare,
    color: 'from-red-500/20 to-red-500/5',
    iconColor: 'text-red-400',
    href: '/admin/dashboard',
  },
]

function InquiryStatusBadge({ status }: { status: string }) {
  const map = {
    new: { label: 'New', class: 'badge bg-red-500/15 text-red-400 border border-red-500/20' },
    contacted: { label: 'Contacted', class: 'badge bg-blue-500/15 text-blue-400 border border-blue-500/20' },
    closed: { label: 'Closed', class: 'badge bg-gray-500/15 text-gray-400 border border-gray-500/20' },
  }
  const s = map[status as keyof typeof map] || map.new
  return <span className={s.class}>{s.label}</span>
}

export default function DashboardClient({ data }: Props) {
  const { stats, recentCars, recentInquiries } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link href="/admin/cars/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Add New Car
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAT_CARDS(stats).map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={card.href} className="block">
              <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 border border-white/8 hover:border-gold-500/20 transition-all duration-300 group`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <card.icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
                  </div>
                </div>
                <div className="font-display font-black text-2xl text-white">{card.value}</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">{card.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 rounded-2xl border border-white/8 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="font-semibold text-white text-sm">Recent Listings</h2>
            <Link href="/admin/cars" className="text-xs text-gold-500 hover:text-gold-400">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentCars.map((car) => (
              <Link
                key={car.id}
                href={`/admin/cars/${car.id}/edit`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/3 transition-colors"
              >
                <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                  {car.images?.[0] ? (
                    <Image src={car.images[0]} alt={car.title} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{car.title}</div>
                  <div className="text-xs text-gray-500">{formatDate(car.created_at)}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gold-500">{formatPrice(car.price)}</div>
                  {car.is_sold ? (
                    <span className="text-xs text-red-400">Sold</span>
                  ) : (
                    <span className="text-xs text-green-400">Available</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 rounded-2xl border border-white/8 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="font-semibold text-white text-sm">Recent Inquiries</h2>
            {stats.newInquiries > 0 && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                {stats.newInquiries} new
              </span>
            )}
          </div>
          <div className="divide-y divide-white/5">
            {recentInquiries.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-600 text-sm">
                No inquiries yet
              </div>
            ) : (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{inquiry.name}</span>
                        <InquiryStatusBadge status={inquiry.status} />
                      </div>
                      {inquiry.car_title && (
                        <div className="text-xs text-gold-500 truncate mt-0.5">{inquiry.car_title}</div>
                      )}
                      {inquiry.message && (
                        <div className="text-xs text-gray-500 truncate mt-0.5">{inquiry.message}</div>
                      )}
                    </div>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-600">{inquiry.phone}</span>
                    <span className="text-xs text-gray-700">·</span>
                    <span className="text-xs text-gray-600">{formatDate(inquiry.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
