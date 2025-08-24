import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, userData } = body

    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email and password are required' 
        },
        { status: 400 }
      )
    }

    // Test signup functionality
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) {
      console.error('Signup test error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Signup failed',
          details: error.message 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Test signup successful',
      user: data.user,
      session: data.session
    })

  } catch (error) {
    console.error('Signup test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Signup test endpoint',
    method: 'Use POST to test signup functionality',
    timestamp: new Date().toISOString()
  })
}