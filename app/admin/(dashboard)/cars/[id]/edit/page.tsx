'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'
import { CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES } from '@/lib/utils'
import { CarFormData } from '@/types'

const CURRENT_YEAR = new Date().getFullYear()

const COMMON_FEATURES = [
  'Power Steering', 'Power Windows', 'Central Locking', 'ABS', 'Airbags',
  'Reverse Camera', 'Rear Parking Sensors', 'Bluetooth Music', 'Apple CarPlay',
  'Android Auto', 'Sunroof', 'Leather Seats', 'Ventilated Seats',
  'Wireless Charging', 'Cruise Control', 'Navigation', '360° Camera',
  'Keyless Entry', 'Push Start', 'Alloy Wheels', 'Fog Lights', 'LED Headlights',
]

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<CarFormData | null>(null)

  useEffect(() => {
    const fetchCar = async () => {
      const res = await fetch(`/api/cars/${id}`)
      const data = await res.json()
      if (data.data) setForm(data.data)
      setLoading(false)
    }
    fetchCar()
  }, [id])

  const update = (key: keyof CarFormData, value: unknown) => {
    setForm((prev) => prev ? { ...prev, [key]: value } : null)
  }

  const toggleFeature = (feat: string) => {
    setForm((prev) => {
      if (!prev) return null
      return {
        ...prev,
        features: prev.features?.includes(feat)
          ? prev.features.filter((f) => f !== feat)
          : [...(prev.features || []), feat],
      }
    })
  }

  const handleSubmit = async () => {
    if (!form) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update listing')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Car not found</p>
        <Link href="/admin/cars" className="btn-secondary mt-4 inline-flex">Back to Listings</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/cars" className="p-2 rounded-xl hover:bg-white/10 text-gray-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-black text-2xl text-white">Edit Listing</h1>
          <p className="text-gray-500 text-sm mt-0.5">{form.title}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-gray-900 rounded-2xl p-6 border border-white/8 space-y-6">
        <div>
          <h2 className="font-semibold text-white text-sm mb-5 pb-3 border-b border-white/8">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input value={form.title} onChange={(e) => update('title', e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Make</label>
                <select value={form.make} onChange={(e) => update('make', e.target.value)} className={selectClass}>
                  {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Model</label>
                <input value={form.model} onChange={(e) => update('model', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Variant</label>
                <input value={form.variant || ''} onChange={(e) => update('variant', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <select value={form.year} onChange={(e) => update('year', Number(e.target.value))} className={selectClass}>
                  {Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i).map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input type="number" value={form.price} onChange={(e) => update('price', Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Original Price (₹)</label>
                <input type="number" value={form.original_price || ''} onChange={(e) => update('original_price', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-white text-sm mb-5 pb-3 border-b border-white/8">Specifications</h2>
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
              <input type="number" value={form.mileage || ''} onChange={(e) => update('mileage', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input value={form.color || ''} onChange={(e) => update('color', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Owners</label>
              <select value={form.owners || 1} onChange={(e) => update('owners', Number(e.target.value))} className={selectClass}>
                {[1, 2, 3, 4].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea value={form.description || ''} onChange={(e) => update('description', e.target.value)} rows={4} className={`${inputClass} resize-none`} />
        </div>

        <div>
          <h2 className="font-semibold text-white text-sm mb-4 pb-3 border-b border-white/8">Features</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COMMON_FEATURES.map((feat) => (
              <label key={feat} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.features?.includes(feat) || false} onChange={() => toggleFeature(feat)} className="w-3.5 h-3.5 accent-gold-500" />
                <span className="text-xs text-gray-400">{feat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-white text-sm mb-4 pb-3 border-b border-white/8">Photos</h2>
          <ImageUploader images={form.images || []} onChange={(imgs) => update('images', imgs)} maxImages={15} />
        </div>

        <div className="flex gap-5 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured || false} onChange={(e) => update('is_featured', e.target.checked)} className="w-4 h-4 accent-gold-500" />
            <span className="text-sm text-gray-300">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_sold || false} onChange={(e) => update('is_sold', e.target.checked)} className="w-4 h-4 accent-red-500" />
            <span className="text-sm text-gray-300">Sold</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/admin/cars" className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/30 transition-all">
          ← Cancel
        </Link>
        <button onClick={handleSubmit} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  )
}
