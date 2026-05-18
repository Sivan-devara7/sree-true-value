import { Car } from '@/types'

/**
 * Format price in Indian Rupee format (₹ X,XX,XXX)
 */
export function formatPrice(price: number): string {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} Lakh`
  }
  return `₹${price.toLocaleString('en-IN')}`
}

/**
 * Format exact price with commas
 */
export function formatPriceExact(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

/**
 * Format mileage in km
 */
export function formatMileage(km: number): string {
  return `${km.toLocaleString('en-IN')} km`
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

/**
 * Calculate EMI
 */
export function calculateEMI(principal: number, ratePercent: number, tenureMonths: number): number {
  const rate = ratePercent / 100 / 12
  const emi = (principal * rate * Math.pow(1 + rate, tenureMonths)) / (Math.pow(1 + rate, tenureMonths) - 1)
  return Math.round(emi)
}

/**
 * Generate WhatsApp URL for car inquiry
 */
export function generateWhatsAppUrl(phone: string, car?: Car, message?: string): string {
  if (!car && !message) {
    return `https://wa.me/c/${phone}`
  }
  const defaultMsg = car
    ? `Hi! I'm interested in the ${car.title} listed at ${formatPrice(car.price)} on Sree True Value. Please share more details.`
    : message || `Hi! I'd like to know more about your car listings.`

  return `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`
}

/**
 * Generate phone call URL
 */
export function generateCallUrl(phone: string): string {
  return `tel:${phone}`
}

/**
 * Get car age from year
 */
export function getCarAge(year: number): string {
  const currentYear = new Date().getFullYear()
  const age = currentYear - year
  if (age === 0) return 'New'
  if (age === 1) return '1 Year Old'
  return `${age} Years Old`
}

/**
 * Get fuel type badge color
 */
export function getFuelTypeColor(fuelType: string): string {
  const colors: Record<string, string> = {
    Petrol: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Diesel: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    CNG: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Electric: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    Hybrid: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    LPG: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  }
  return colors[fuelType] || 'bg-gray-100 text-gray-800'
}

/**
 * Truncate text to a certain length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Get Supabase storage public URL
 */
export function getStorageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !path) return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop'
  if (path.startsWith('http')) return path
  return `${supabaseUrl}/storage/v1/object/public/car-images/${path}`
}

/**
 * Format date string
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Get owners label
 */
export function getOwnersLabel(owners: number): string {
  if (owners === 1) return '1st Owner'
  if (owners === 2) return '2nd Owner'
  if (owners === 3) return '3rd Owner'
  return `${owners}th Owner`
}

/**
 * Popular car makes in India
 */
export const CAR_MAKES = [
  'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda',
  'Toyota', 'Kia', 'MG', 'Volkswagen', 'Skoda',
  'Ford', 'Renault', 'Nissan', 'Jeep', 'Mercedes-Benz',
  'BMW', 'Audi', 'Volvo', 'Jaguar', 'Land Rover', 'Other'
]

export const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG']
export const TRANSMISSION_TYPES = ['Manual', 'Automatic', 'CVT', 'DCT', 'AMT']
export const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Pickup', 'Van', 'Minivan']

export const DEALER_INFO = {
  name: 'Sree True Value',
  tagline: 'Find Your Perfect Drive',
  address: 'X7J3+7WX, Gandhiji Rd, Ranga Rao Nagar, Vakalapudi, Andhra Pradesh 533003',
  phone: '+91 90008 30755',
  whatsapp: '919000830755',
  email: 'Sreetruevalue@gmail.com',
  hours: 'Mon–Sat: 9:00 AM – 7:00 PM',
  sunday: 'Sunday: 10:00 AM – 5:00 PM',
  mapEmbedUrl: 'https://maps.google.com/maps?q=16.981131076049156,82.25510493006232&t=&z=16&ie=UTF8&iwloc=&output=embed',
}
