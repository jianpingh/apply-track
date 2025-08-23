import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, userData } = body

    console.log('Testing signup with:', { email, userData })

    // Step 1: Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ 
        success: false, 
        error: authError.message,
        step: 'authentication'
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ 
        success: false, 
        error: 'No user created',
        step: 'authentication'
      }, { status: 400 })
    }

    console.log('User created:', authData.user.id)

    // Step 2: Create profile record
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: userData.full_name,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ 
        success: false, 
        error: profileError.message,
        step: 'profile_creation',
        userId: authData.user.id
      }, { status: 400 })
    }

    console.log('Profile created:', profileData)

    // Step 3: Create role-specific record
    if (userData.role === 'student' && userData.graduation_year) {
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          id: authData.user.id,
          graduation_year: parseInt(userData.graduation_year),
          target_countries: [],
          intended_majors: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (studentError) {
        console.error('Student record error:', studentError)
        return NextResponse.json({ 
          success: false, 
          error: studentError.message,
          step: 'student_record_creation',
          profile: profileData
        }, { status: 400 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User, profile, and role-specific records created successfully',
      user: authData.user,
      profile: profileData
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error: ' + (error as Error).message,
      step: 'api_error'
    }, { status: 500 })
  }
}
