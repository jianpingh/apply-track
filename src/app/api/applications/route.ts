import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const status = searchParams.get('status')
    
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('applications')
      .select(`
        *,
        universities (
          id,
          name,
          short_name,
          city,
          state,
          us_news_ranking,
          acceptance_rate,
          tuition_out_state,
          application_fee,
          deadlines
        )
      `)
      .eq('student_id', studentId)
      .order('deadline', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: applications, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ applications })
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
    
    const { data: application, error } = await supabase
      .from('applications')
      .insert(body)
      .select(`
        *,
        universities (
          id,
          name,
          short_name,
          city,
          state,
          us_news_ranking,
          acceptance_rate,
          tuition_out_state,
          application_fee,
          deadlines
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: body.student_id,
      student_id: body.student_id,
      application_id: application.id,
      action: 'created_application',
      details: {
        university_name: application.universities.name,
        application_type: body.application_type
      }
    })

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
