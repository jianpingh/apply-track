import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')
    
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    const { data: applications, error } = await supabase
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
      .order('created_at', { ascending: false })

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
    
    // Create the application with type assertion for Supabase
    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        student_id: body.student_id,
        university_id: body.university_id,
        application_type: body.application_type,
        status: body.status || 'not_started',
        priority: body.priority,
        deadline: body.deadline,
        notes: body.notes,
        application_url: body.application_url,
      })
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

    // Log activity with type assertion
    await supabase.from('activity_log').insert({
      user_id: body.student_id,
      student_id: body.student_id,
      application_id: application.id,
      action: 'created_application',
      details: {
        university_name: body.university_name,
        application_type: body.application_type,
      }
    })

    return NextResponse.json({ application })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
