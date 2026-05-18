import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CarDetailClient from './_CarDetailClient'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()

  const { data: car } = await supabase
    .from('cars')
    .select('*')
    .or(`slug.eq.${params.id},id.eq.${params.id}`)
    .single()

  if (!car) return { title: 'Car Not Found' }

  return {
    title: `${car.title} — Sree True Value Kakinada`,
    description: `Buy ${car.title} at ₹${(car.price / 100000).toFixed(1)} Lakh. ${car.mileage?.toLocaleString('en-IN')} km driven. ${car.fuel_type}, ${car.transmission}. Contact Sree True Value, Kakinada.`,
    openGraph: {
      title: car.title,
      description: `Available at Sree True Value for ₹${(car.price / 100000).toFixed(1)} Lakh`,
      images: car.images?.[0] ? [{ url: car.images[0] }] : [],
    },
  }
}

async function getCar(id: string) {
  const supabase = await createClient()

  let { data } = await supabase
    .from('cars')
    .select('*')
    .eq('slug', id)
    .eq('is_active', true)
    .single()

  if (!data) {
    const result = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    data = result.data
  }

  return data
}

async function getRelatedCars(car: { id: string; make: string; body_type: string | null }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cars')
    .select('*')
    .eq('is_active', true)
    .eq('is_sold', false)
    .neq('id', car.id)
    .or(`make.eq.${car.make},body_type.eq.${car.body_type}`)
    .limit(4)
  return data || []
}

export default async function CarDetailPage({ params }: Props) {
  const car = await getCar(params.id)

  if (!car) notFound()

  const relatedCars = await getRelatedCars(car)

  return <CarDetailClient car={car} relatedCars={relatedCars} />
}
