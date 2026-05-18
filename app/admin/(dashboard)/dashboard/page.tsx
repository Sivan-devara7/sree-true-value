import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import DashboardClient from './_DashboardClient'

export const metadata: Metadata = { title: 'Dashboard — Admin' }

async function getDashboardData() {
  const supabase = await createClient()

  const [
    { count: totalCars },
    { count: soldCars },
    { count: featuredCars },
    { count: newInquiries },
    { data: recentCars },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from('cars').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('cars').select('*', { count: 'exact', head: true }).eq('is_sold', true).eq('is_active', true),
    supabase.from('cars').select('*', { count: 'exact', head: true }).eq('is_featured', true).eq('is_active', true),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('cars').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(5),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  return {
    stats: {
      totalCars: totalCars || 0,
      soldCars: soldCars || 0,
      availableCars: (totalCars || 0) - (soldCars || 0),
      featuredCars: featuredCars || 0,
      newInquiries: newInquiries || 0,
    },
    recentCars: recentCars || [],
    recentInquiries: recentInquiries || [],
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  return <DashboardClient data={data} />
}
