import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test basic database connection
    const { data, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('Database test error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      recordCount: data?.length || 0
    })

  } catch (error) {
    console.error('Database test error:', error)
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