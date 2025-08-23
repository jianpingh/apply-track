import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { email, password, userData } = await request.json()

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.getUser()
    
    if (existingUser) {
      return NextResponse.json({ 
        error: 'User already exists' 
      }, { status: 400 })
    }

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role,
        }
      }
    })

    if (authError) {
      return NextResponse.json({ 
        error: authError.message 
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Failed to create user' 
      }, { status: 500 })
    }

    // Create profile record
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: userData.full_name,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ 
        error: 'Failed to create profile: ' + profileError.message 
      }, { status: 500 })
    }

    // Create additional records based on role
    if (userData.role === 'student' && userData.studentData) {
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          id: authData.user.id,
          graduation_year: userData.studentData.graduation_year,
          gpa: userData.studentData.gpa,
          sat_score: userData.studentData.sat_score,
          act_score: userData.studentData.act_score,
          target_countries: userData.studentData.target_countries || ['United States'],
          intended_majors: userData.studentData.intended_majors || [],
          high_school: userData.studentData.high_school,
          counselor_name: userData.studentData.counselor_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (studentError) {
        return NextResponse.json({ 
          error: 'Failed to create student record: ' + studentError.message 
        }, { status: 500 })
      }
    }

    if (userData.role === 'parent' && userData.parentData) {
      const { error: parentError } = await supabase
        .from('parents')
        .insert({
          id: authData.user.id,
          relationship: userData.parentData.relationship,
          phone_number: userData.parentData.phone_number,
          occupation: userData.parentData.occupation,
          education_level: userData.parentData.education_level,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (parentError) {
        return NextResponse.json({ 
          error: 'Failed to create parent record: ' + parentError.message 
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: userData.role,
      },
      profile: profileData
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
