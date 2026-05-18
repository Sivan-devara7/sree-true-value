import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CarFilters } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search') || ''
    const make = searchParams.get('make') || ''
    const fuel_type = searchParams.get('fuel_type') || ''
    const transmission = searchParams.get('transmission') || ''
    const body_type = searchParams.get('body_type') || ''
    const min_price = searchParams.get('min_price')
    const max_price = searchParams.get('max_price')
    const min_year = searchParams.get('min_year')
    const max_year = searchParams.get('max_year')
    const is_featured = searchParams.get('is_featured')
    const is_sold = searchParams.get('is_sold')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    let query = supabase
      .from('cars')
      .select('*', { count: 'exact' })
      .eq('is_active', true)

    if (search) {
      query = query.or(`title.ilike.%${search}%,make.ilike.%${search}%,model.ilike.%${search}%`)
    }
    if (make) query = query.eq('make', make)
    if (fuel_type) query = query.eq('fuel_type', fuel_type)
    if (transmission) query = query.eq('transmission', transmission)
    if (body_type) query = query.eq('body_type', body_type)
    if (min_price) query = query.gte('price', parseInt(min_price))
    if (max_price) query = query.lte('price', parseInt(max_price))
    if (min_year) query = query.gte('year', parseInt(min_year))
    if (max_year) query = query.lte('year', parseInt(max_year))
    if (is_featured === 'true') query = query.eq('is_featured', true)
    if (is_sold === 'true') {
      query = query.eq('is_sold', true)
    } else if (is_sold !== 'all') {
      query = query.eq('is_sold', false)
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'mileage_asc':
        query = query.order('mileage', { ascending: true })
        break
      case 'oldest':
        query = query.order('year', { ascending: true })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('GET /api/cars error:', error)
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('cars')
      .insert(body)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/cars error:', error)
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}
