import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: application, error } = await supabase
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
          deadlines,
          popular_majors,
          website_url
        ),
        application_requirements (
          id,
          requirement_type,
          requirement_name,
          status,
          deadline,
          notes,
          completed_date
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { student_id, ...updateData } = body
    
    const supabaseClient = supabase
    
    const { data: application, error } = await supabaseClient
      .from('applications')
      .update(updateData)
      .eq('id', params.id)
      .eq('student_id', student_id) // Ensure user can only update their own applications
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
    await supabaseClient.from('activity_log').insert({
      user_id: student_id,
      student_id: student_id,
      application_id: params.id,
      action: 'updated_application',
      details: {
        changes: updateData
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', params.id)
      .eq('student_id', studentId) // Ensure user can only delete their own applications

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log activity
    const supabaseClientForLog = supabase as any
    await supabaseClientForLog.from('activity_log').insert({
      user_id: studentId,
      student_id: studentId,
      application_id: params.id,
      action: 'deleted_application',
      details: {}
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
