'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, Star, StarOff,
  CheckCircle, XCircle, Car, Loader2, MoreHorizontal
} from 'lucide-react'
import { Car as CarType } from '@/types'
import { formatPrice, formatMileage, formatDate } from '@/lib/utils'

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'available' | 'sold' | 'featured'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchCars = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100', sort: 'newest' })
      if (filter === 'sold') params.set('is_sold', 'true')
      if (filter === 'featured') params.set('is_featured', 'true')
      const res = await fetch(`/api/cars?${params}`)
      const data = await res.json()
      setCars(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCars() }, [filter])

  const filteredCars = cars.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.make.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    setDeletingId(id)
    try {
      await fetch(`/api/cars/${id}`, { method: 'DELETE' })
      setCars((prev) => prev.filter((c) => c.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggle = async (car: CarType, field: 'is_sold' | 'is_featured') => {
    setUpdatingId(car.id)
    try {
      await fetch(`/api/cars/${car.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !car[field] }),
      })
      setCars((prev) =>
        prev.map((c) => (c.id === car.id ? { ...c, [field]: !c[field] } : c))
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">Car Listings</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filteredCars.length} vehicles</p>
        </div>
        <Link href="/admin/cars/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Add New Car
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cars..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'available', 'sold', 'featured'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all capitalize ${
                filter === f
                  ? 'bg-gold-500 text-black'
                  : 'bg-gray-900 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cars Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No cars found</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-white/8 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/8">
                <tr className="text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Car</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Added</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCars.map((car) => (
                  <motion.tr
                    key={car.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                          {car.images?.[0] ? (
                            <Image src={car.images[0]} alt={car.title} fill className="object-cover" sizes="64px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white line-clamp-1 max-w-[200px]">{car.title}</div>
                          <div className="text-xs text-gray-500">{car.year} · {car.fuel_type} · {car.transmission}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-gold-500">{formatPrice(car.price)}</div>
                      {car.original_price && (
                        <div className="text-xs text-gray-600 line-through">{formatPrice(car.original_price)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-400">
                        {car.mileage != null && <div>{formatMileage(car.mileage)}</div>}
                        {car.color && <div>{car.color}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {car.is_sold ? (
                          <span className="badge-sold text-xs">Sold</span>
                        ) : (
                          <span className="badge-available text-xs">Available</span>
                        )}
                        {car.is_featured && (
                          <span className="badge-gold text-xs">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(car.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggle(car, 'is_featured')}
                          disabled={updatingId === car.id}
                          title={car.is_featured ? 'Remove from featured' : 'Mark as featured'}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gold-400 transition-colors disabled:opacity-50"
                        >
                          {car.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleToggle(car, 'is_sold')}
                          disabled={updatingId === car.id}
                          title={car.is_sold ? 'Mark as available' : 'Mark as sold'}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
                        >
                          {car.is_sold ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <Link
                          href={`/admin/cars/${car.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(car.id)}
                          disabled={deletingId === car.id}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          {deletingId === car.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-white/5">
            {filteredCars.map((car) => (
              <div key={car.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                    {car.images?.[0] ? (
                      <Image src={car.images[0]} alt={car.title} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white line-clamp-2">{car.title}</div>
                    <div className="text-sm font-bold text-gold-500 mt-0.5">{formatPrice(car.price)}</div>
                    <div className="flex gap-2 mt-1.5">
                      {car.is_sold ? <span className="badge-sold text-xs">Sold</span> : <span className="badge-available text-xs">Available</span>}
                      {car.is_featured && <span className="badge-gold text-xs">Featured</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Link href={`/admin/cars/${car.id}/edit`} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => handleDelete(car.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
