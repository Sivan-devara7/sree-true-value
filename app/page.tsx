import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import HeroSection from './_components/HeroSection'
import StatsSection from './_components/StatsSection'
import FeaturedCars from './_components/FeaturedCars'
import ServicesSection from './_components/ServicesSection'
import TestimonialsSection from './_components/TestimonialsSection'
import ContactSection from './_components/ContactSection'

export const metadata: Metadata = {
  title: 'Sree True Value — Premium Used Cars in Kakinada',
  description:
    "Find your perfect pre-owned car at Kakinada's most trusted dealership. Certified used cars, transparent pricing, and hassle-free buying experience.",
}

async function getFeaturedCars() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .eq('is_sold', false)
      .order('created_at', { ascending: false })
      .limit(8)
      
    if (error) throw error;
    return data || []
  } catch (err) {
    return []
  }
}

async function getStats() {
  try {
    const supabase = await createClient()
    const { count: totalCars, error: err1 } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: soldCars, error: err2 } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true })
      .eq('is_sold', true)
      .eq('is_active', true)

    if (err1 || err2) throw err1 || err2;

    return {
      total: totalCars || 0,
      sold: soldCars || 0,
      available: (totalCars || 0) - (soldCars || 0),
    }
  } catch (err) {
    return {
      total: 0,
      sold: 0,
      available: 0,
    }
  }
}

export default async function HomePage() {
  const [featuredCars, stats] = await Promise.all([
    getFeaturedCars(),
    getStats(),
  ])

  return (
    <>
      <HeroSection />
      <StatsSection stats={stats} />
      <FeaturedCars cars={featuredCars} />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
