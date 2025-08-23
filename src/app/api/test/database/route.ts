import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Test if we can connect to the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      if (error.message.includes('relation "public.profiles" does not exist')) {
        return NextResponse.json({
          success: false,
          message: 'Database tables not found',
          error: error.message,
          instructions: [
            '1. Go to your Supabase dashboard',
            '2. Open the SQL Editor',
            '3. Run the SQL from supabase/create_tables.sql',
            '4. Refresh this page to test again'
          ]
        }, { status: 500 })
      }
      
      return NextResponse.json({
        success: false,
        message: 'Database connection error',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      tables: ['profiles', 'students', 'parents', 'universities']
    })

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: 'Unexpected error',
      error: (err as Error).message
    }, { status: 500 })
  }
}
