'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, LayoutGrid, List, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Car, CarFilters } from '@/types'
import CarCard from '@/components/cars/CarCard'
import CarFiltersPanel from '@/components/cars/CarFilters'
import { useSearchParams, useRouter } from 'next/navigation'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'mileage_asc', label: 'Lowest Mileage' },
  { value: 'oldest', label: 'Oldest Year' },
]

export default function InventoryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [cars, setCars] = useState<Car[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const [filters, setFilters] = useState<CarFilters>({
    search: searchParams.get('search') || '',
    make: searchParams.get('make') || undefined,
    fuel_type: (searchParams.get('fuel_type') as any) || undefined,
    transmission: (searchParams.get('transmission') as any) || undefined,
    body_type: (searchParams.get('body_type') as any) || undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    is_featured: searchParams.get('featured') === 'true' ? true : undefined,
    sort: 'newest',
  })

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', '12')

      if (filters.search) params.set('search', filters.search)
      if (filters.make) params.set('make', filters.make)
      if (filters.fuel_type) params.set('fuel_type', filters.fuel_type)
      if (filters.transmission) params.set('transmission', filters.transmission)
      if (filters.body_type) params.set('body_type', filters.body_type)
      if (filters.min_price) params.set('min_price', String(filters.min_price))
      if (filters.max_price) params.set('max_price', String(filters.max_price))
      if (filters.min_year) params.set('min_year', String(filters.min_year))
      if (filters.max_year) params.set('max_year', String(filters.max_year))
      if (filters.is_featured) params.set('is_featured', 'true')
      if (filters.sort) params.set('sort', filters.sort)

      const response = await fetch(`/api/cars?${params.toString()}`)
      const data = await response.json()

      setCars(data.data || [])
      setTotalCount(data.count || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch cars:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, search: searchInput }))
    setPage(1)
  }

  const handleFiltersChange = (newFilters: CarFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const activeFiltersCount = [
    filters.make,
    filters.fuel_type,
    filters.transmission,
    filters.body_type,
    filters.min_price || filters.max_price,
    filters.min_year || filters.max_year,
    filters.is_featured,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-gray-900 dark:text-white mb-2">
            {filters.is_featured ? 'Featured' : 'All'}{' '}
            <span className="text-gradient-gold">Vehicles</span>
          </h1>
          <p className="text-gray-500 text-sm">
            {loading ? 'Loading...' : `${totalCount} cars available`}
            {filters.make && ` · ${filters.make}`}
            {filters.body_type && ` · ${filters.body_type}`}
          </p>

          {/* Search + Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by make, model, or variant..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-gold-500 transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setFilters(f => ({ ...f, search: '' })); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Sort */}
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as CarFilters['sort'] }))}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-gold-500 transition-colors text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Filter Toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-gold-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <CarFiltersPanel
                filters={filters}
                onChange={handleFiltersChange}
                totalResults={totalCount}
              />
            </div>
          </aside>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto pt-20 pb-8 px-4 lg:hidden"
              >
                <button
                  onClick={() => setShowFilters(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                <CarFiltersPanel
                  filters={filters}
                  onChange={handleFiltersChange}
                  totalResults={totalCount}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Car Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Loading vehicles...</p>
                </div>
              </div>
            ) : cars.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-4">🚗</div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
                  No cars found
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => { setFilters({ sort: 'newest' }); setSearchInput('') }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car, index) => (
                    <CarCard key={car.id} car={car} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:border-gold-500 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                          page === p
                            ? 'bg-gold-500 text-black'
                            : 'border border-gray-200 dark:border-white/10 hover:border-gold-500'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:border-gold-500 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
