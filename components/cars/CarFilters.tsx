'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { CarFilters, FuelType, TransmissionType, BodyType } from '@/types'
import { FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES, CAR_MAKES } from '@/lib/utils'

interface CarFiltersProps {
  filters: CarFilters
  onChange: (filters: CarFilters) => void
  totalResults: number
}

const PRICE_RANGES = [
  { label: 'Under ₹3 Lakh', min: 0, max: 300000 },
  { label: '₹3–5 Lakh', min: 300000, max: 500000 },
  { label: '₹5–8 Lakh', min: 500000, max: 800000 },
  { label: '₹8–12 Lakh', min: 800000, max: 1200000 },
  { label: '₹12–20 Lakh', min: 1200000, max: 2000000 },
  { label: 'Above ₹20 Lakh', min: 2000000, max: undefined },
]

const YEAR_RANGES = [
  { label: '2022+', min: 2022 },
  { label: '2020–2021', min: 2020, max: 2021 },
  { label: '2017–2019', min: 2017, max: 2019 },
  { label: '2015–2016', min: 2015, max: 2016 },
  { label: 'Before 2015', max: 2014 },
]

interface AccordionSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function AccordionSection({ title, children, defaultOpen = true }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 dark:border-white/8 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors"
      >
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        active
          ? 'bg-gold-500 text-black shadow-sm shadow-gold-500/30'
          : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  )
}

export default function CarFiltersPanel({ filters, onChange, totalResults }: CarFiltersProps) {
  const activeFilterCount = [
    filters.make,
    filters.fuel_type,
    filters.transmission,
    filters.body_type,
    filters.min_price || filters.max_price,
    filters.min_year || filters.max_year,
  ].filter(Boolean).length

  const clearFilters = () => {
    onChange({ sort: filters.sort })
  }

  const toggleFuel = (fuel: FuelType) => {
    onChange({ ...filters, fuel_type: filters.fuel_type === fuel ? undefined : fuel })
  }

  const toggleTransmission = (trans: TransmissionType) => {
    onChange({ ...filters, transmission: filters.transmission === trans ? undefined : trans })
  }

  const toggleBodyType = (body: BodyType) => {
    onChange({ ...filters, body_type: filters.body_type === body ? undefined : body })
  }

  const toggleMake = (make: string) => {
    onChange({ ...filters, make: filters.make === make ? undefined : make })
  }

  const setPriceRange = (min?: number, max?: number) => {
    const alreadyActive = filters.min_price === min && filters.max_price === max
    onChange({ ...filters, min_price: alreadyActive ? undefined : min, max_price: alreadyActive ? undefined : max })
  }

  const setYearRange = (min?: number, max?: number) => {
    const alreadyActive = filters.min_year === min && filters.max_year === max
    onChange({ ...filters, min_year: alreadyActive ? undefined : min, max_year: alreadyActive ? undefined : max })
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gold-500" />
          <span className="font-semibold text-sm text-gray-900 dark:text-white">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-gold-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{totalResults} cars</span>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="px-5 divide-y divide-gray-100 dark:divide-white/8">
        {/* Budget */}
        <AccordionSection title="Budget">
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGES.map((range) => (
              <FilterChip
                key={range.label}
                label={range.label}
                active={filters.min_price === range.min && filters.max_price === range.max}
                onClick={() => setPriceRange(range.min, range.max)}
              />
            ))}
          </div>
        </AccordionSection>

        {/* Fuel Type */}
        <AccordionSection title="Fuel Type">
          <div className="flex flex-wrap gap-2">
            {FUEL_TYPES.map((fuel) => (
              <FilterChip
                key={fuel}
                label={fuel}
                active={filters.fuel_type === fuel}
                onClick={() => toggleFuel(fuel as FuelType)}
              />
            ))}
          </div>
        </AccordionSection>

        {/* Transmission */}
        <AccordionSection title="Transmission">
          <div className="flex flex-wrap gap-2">
            {TRANSMISSION_TYPES.map((trans) => (
              <FilterChip
                key={trans}
                label={trans}
                active={filters.transmission === trans}
                onClick={() => toggleTransmission(trans as TransmissionType)}
              />
            ))}
          </div>
        </AccordionSection>

        {/* Body Type */}
        <AccordionSection title="Body Type">
          <div className="flex flex-wrap gap-2">
            {BODY_TYPES.map((body) => (
              <FilterChip
                key={body}
                label={body}
                active={filters.body_type === body}
                onClick={() => toggleBodyType(body as BodyType)}
              />
            ))}
          </div>
        </AccordionSection>

        {/* Year */}
        <AccordionSection title="Year">
          <div className="flex flex-wrap gap-2">
            {YEAR_RANGES.map((range) => (
              <FilterChip
                key={range.label}
                label={range.label}
                active={filters.min_year === range.min && filters.max_year === range.max}
                onClick={() => setYearRange(range.min, range.max)}
              />
            ))}
          </div>
        </AccordionSection>

        {/* Popular Makes */}
        <AccordionSection title="Brand" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {CAR_MAKES.slice(0, 12).map((make) => (
              <FilterChip
                key={make}
                label={make}
                active={filters.make === make}
                onClick={() => toggleMake(make)}
              />
            ))}
          </div>
        </AccordionSection>
      </div>
    </div>
  )
}
