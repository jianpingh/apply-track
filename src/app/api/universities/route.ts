import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const state = searchParams.get('state') || ''
    const maxRanking = searchParams.get('maxRanking') || '100'
    const minAcceptanceRate = searchParams.get('minAcceptanceRate') || '0'
    const maxTuition = searchParams.get('maxTuition') || '100000'
    const applicationSystem = searchParams.get('applicationSystem') || ''
    
    let query = supabase
      .from('universities')
      .select('*')
      .order('us_news_ranking', { ascending: true })

    if (search) {
      query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%`)
    }

    if (state) {
      query = query.eq('state', state)
    }

    if (maxRanking !== '100') {
      query = query.lte('us_news_ranking', parseInt(maxRanking))
    }

    if (minAcceptanceRate !== '0') {
      query = query.gte('acceptance_rate', parseFloat(minAcceptanceRate))
    }

    if (maxTuition !== '100000') {
      query = query.lte('tuition_out_state', parseInt(maxTuition))
    }

    if (applicationSystem) {
      query = query.eq('application_system', applicationSystem)
    }

    const { data: universities, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ universities })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: university, error } = await supabase
      .from('universities')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ university }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
