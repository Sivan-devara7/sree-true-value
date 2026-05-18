'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Car, ChevronRight, Save, Loader2, AlertCircle } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import {
  CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES
} from '@/lib/utils'
import { CarFormData } from '@/types'

const STEPS = ['Basic Info', 'Specs & Details', 'Images', 'Preview']

const COMMON_FEATURES = [
  'Power Steering', 'Power Windows', 'Central Locking', 'ABS', 'Airbags',
  'Reverse Camera', 'Rear Parking Sensors', 'Bluetooth Music', 'Apple CarPlay',
  'Android Auto', 'Sunroof', 'Leather Seats', 'Ventilated Seats',
  'Wireless Charging', 'Cruise Control', 'Navigation', '360° Camera',
  'Keyless Entry', 'Push Start', 'Alloy Wheels', 'Fog Lights', 'LED Headlights',
]

const CURRENT_YEAR = new Date().getFullYear()

export default function NewCarPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<CarFormData>({
    title: '',
    make: '',
    model: '',
    variant: '',
    year: CURRENT_YEAR - 2,
    price: 0,
    original_price: undefined,
    mileage: undefined,
    fuel_type: undefined,
    transmission: undefined,
    body_type: undefined,
    color: '',
    seats: 5,
    registration_year: undefined,
    registration_state: 'AP',
    owners: 1,
    description: '',
    features: [],
    images: [],
    is_featured: false,
    is_sold: false,
  })

  const update = (key: keyof CarFormData, value: unknown) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value }
      // Auto-generate title
      if (['year', 'make', 'model', 'variant'].includes(key)) {
        const title = [updated.year, updated.make, updated.model, updated.variant]
          .filter(Boolean)
          .join(' ')
        return { ...updated, title }
      }
      return updated
    })
  }

  const toggleFeature = (feat: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features?.includes(feat)
        ? prev.features.filter((f) => f !== feat)
        : [...(prev.features || []), feat],
    }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create listing')
      }
      router.push('/admin/cars')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors placeholder-gray-600"
  const selectClass = "w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
  const labelClass = "block text-xs font-semibold text-gray-400 mb-1.5"

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white">Add New Car</h1>
        <p className="text-gray-500 text-sm mt-0.5">List a new vehicle in the inventory</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <button
              onClick={() => i < step + 1 && setStep(i)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                i === step
                  ? 'bg-gold-500 text-black'
                  : i < step
                    ? 'bg-gold-500/20 text-gold-400 cursor-pointer'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {i + 1}. {s}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-white/8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Step 1: Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white text-base mb-5">Basic Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Make *</label>
                  <select value={form.make} onChange={(e) => update('make', e.target.value)} className={selectClass}>
                    <option value="">Select Make</option>
                    {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Model *</label>
                  <input value={form.model} onChange={(e) => update('model', e.target.value)} placeholder="e.g. Swift" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Variant</label>
                  <input value={form.variant || ''} onChange={(e) => update('variant', e.target.value)} placeholder="e.g. VXI, VDI, ZXI+" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Year *</label>
                  <select value={form.year} onChange={(e) => update('year', Number(e.target.value))} className={selectClass}>
                    {Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Auto-Generated Title</label>
                <input
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. 2021 Maruti Suzuki Swift VXI"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => update('price', Number(e.target.value))}
                    placeholder="650000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Original Price (₹) <span className="text-gray-600">optional</span></label>
                  <input
                    type="number"
                    value={form.original_price || ''}
                    onChange={(e) => update('original_price', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="720000"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => update('is_featured', e.target.checked)}
                    className="w-4 h-4 accent-gold-500"
                  />
                  <span className="text-sm text-gray-300">Mark as Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_sold}
                    onChange={(e) => update('is_sold', e.target.checked)}
                    className="w-4 h-4 accent-red-500"
                  />
                  <span className="text-sm text-gray-300">Mark as Sold</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Specs */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white text-base mb-5">Specifications & Details</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Fuel Type</label>
                  <select value={form.fuel_type || ''} onChange={(e) => update('fuel_type', e.target.value || undefined)} className={selectClass}>
                    <option value="">Select</option>
                    {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Transmission</label>
                  <select value={form.transmission || ''} onChange={(e) => update('transmission', e.target.value || undefined)} className={selectClass}>
                    <option value="">Select</option>
                    {TRANSMISSION_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Body Type</label>
                  <select value={form.body_type || ''} onChange={(e) => update('body_type', e.target.value || undefined)} className={selectClass}>
                    <option value="">Select</option>
                    {BODY_TYPES.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Mileage (km)</label>
                  <input type="number" value={form.mileage || ''} onChange={(e) => update('mileage', e.target.value ? Number(e.target.value) : undefined)} placeholder="35000" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <input value={form.color || ''} onChange={(e) => update('color', e.target.value)} placeholder="Pearl Arctic White" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Seats</label>
                  <select value={form.seats || 5} onChange={(e) => update('seats', Number(e.target.value))} className={selectClass}>
                    {[2, 4, 5, 6, 7, 8, 9].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Owners</label>
                  <select value={form.owners || 1} onChange={(e) => update('owners', Number(e.target.value))} className={selectClass}>
                    {[1, 2, 3, 4].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Reg. Year</label>
                  <select value={form.registration_year || ''} onChange={(e) => update('registration_year', e.target.value ? Number(e.target.value) : undefined)} className={selectClass}>
                    <option value="">Select</option>
                    {Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i).map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Reg. State</label>
                  <input value={form.registration_state || 'AP'} onChange={(e) => update('registration_state', e.target.value)} placeholder="AP" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                  placeholder="Describe the car's condition, history, and any notable features..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Features Checklist */}
              <div>
                <label className={labelClass}>Features & Highlights</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_FEATURES.map((feat) => (
                    <label key={feat} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.features?.includes(feat) || false}
                        onChange={() => toggleFeature(feat)}
                        className="w-3.5 h-3.5 accent-gold-500"
                      />
                      <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{feat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white text-base mb-5">Car Photos</h2>
              <p className="text-sm text-gray-400">Upload high-quality photos. The first image will be the cover photo shown in listings.</p>
              <ImageUploader
                images={form.images || []}
                onChange={(imgs) => update('images', imgs)}
                maxImages={15}
              />
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white text-base mb-5">Review & Publish</h2>
              <div className="bg-gray-800 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-bold text-lg">{form.title || 'Untitled'}</div>
                    {form.variant && <div className="text-gray-400 text-sm">{form.variant}</div>}
                  </div>
                  <div className="text-gold-500 font-bold text-xl">
                    {form.price ? `₹${(form.price / 100000).toFixed(2)} L` : '₹0'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {form.year && <div><span className="text-gray-500">Year:</span> <span className="text-gray-300">{form.year}</span></div>}
                  {form.mileage && <div><span className="text-gray-500">KM:</span> <span className="text-gray-300">{form.mileage?.toLocaleString()}</span></div>}
                  {form.fuel_type && <div><span className="text-gray-500">Fuel:</span> <span className="text-gray-300">{form.fuel_type}</span></div>}
                  {form.transmission && <div><span className="text-gray-500">Transmission:</span> <span className="text-gray-300">{form.transmission}</span></div>}
                  {form.body_type && <div><span className="text-gray-500">Body:</span> <span className="text-gray-300">{form.body_type}</span></div>}
                  {form.color && <div><span className="text-gray-500">Color:</span> <span className="text-gray-300">{form.color}</span></div>}
                </div>
                <div className="flex gap-2">
                  {form.is_featured && <span className="badge-gold text-xs">Featured</span>}
                  {form.is_sold && <span className="badge-sold text-xs">Sold</span>}
                  <span className="text-xs text-gray-500">{form.images?.length || 0} photos</span>
                  <span className="text-xs text-gray-500">{form.features?.length || 0} features</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-30 transition-all"
        >
          ← Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="btn-primary text-sm"
          >
            Next Step →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={saving || !form.title || !form.price}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
            ) : (
              <><Save className="w-4 h-4" /> Publish Listing</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
