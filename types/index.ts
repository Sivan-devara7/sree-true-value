// ============================================================
// SREE TRUE VALUE — TypeScript Types
// ============================================================

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid' | 'LPG'
export type TransmissionType = 'Manual' | 'Automatic' | 'CVT' | 'DCT' | 'AMT'
export type BodyType = 'Sedan' | 'Hatchback' | 'SUV' | 'MUV' | 'Coupe' | 'Convertible' | 'Pickup' | 'Van' | 'Minivan'
export type InquiryStatus = 'new' | 'contacted' | 'closed'
export type InquirySource = 'website' | 'whatsapp' | 'phone' | 'walkin'

export interface Car {
  id: string
  created_at: string
  updated_at: string
  title: string
  make: string
  model: string
  variant: string | null
  year: number
  price: number
  original_price: number | null
  mileage: number | null
  fuel_type: FuelType | null
  transmission: TransmissionType | null
  body_type: BodyType | null
  color: string | null
  seats: number | null
  registration_year: number | null
  registration_state: string | null
  owners: number | null
  description: string | null
  features: string[]
  insurance_validity: string | null
  images: string[]
  is_featured: boolean
  is_sold: boolean
  is_active: boolean
  slug: string | null
}

export interface Inquiry {
  id: string
  created_at: string
  car_id: string | null
  car_title: string | null
  name: string
  phone: string
  email: string | null
  message: string | null
  status: InquiryStatus
  source: InquirySource
}

export interface CarFilters {
  search?: string
  make?: string
  fuel_type?: FuelType
  transmission?: TransmissionType
  body_type?: BodyType
  min_price?: number
  max_price?: number
  min_year?: number
  max_year?: number
  max_mileage?: number
  is_featured?: boolean
  is_sold?: boolean
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'mileage_asc'
}

export interface CarFormData {
  title: string
  make: string
  model: string
  variant?: string
  year: number
  price: number
  original_price?: number
  mileage?: number
  fuel_type?: FuelType
  transmission?: TransmissionType
  body_type?: BodyType
  color?: string
  seats?: number
  registration_year?: number
  registration_state?: string
  owners?: number
  description?: string
  features?: string[]
  insurance_validity?: string
  images?: string[]
  is_featured?: boolean
  is_sold?: boolean
}

export interface DashboardStats {
  total_cars: number
  available_cars: number
  sold_cars: number
  featured_cars: number
  total_inquiries: number
  new_inquiries: number
  this_month_cars: number
}

export type ApiResponse<T> = {
  data: T | null
  error: string | null
  success: boolean
}
