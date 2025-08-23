import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Admin client for server-side operations
const supabaseAdmin = createClient<Database>(
  supabaseUrl, 
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Helper functions for authentication
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData: { 
    full_name: string, 
    role: 'student' | 'parent',
    graduation_year?: number 
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: userData.full_name,
          role: userData.role,
          graduation_year: userData.graduation_year
        }
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Helper functions for profiles
export const profiles = {
  // Create user profile after signup
  create: async (userId: string, profileData: {
    full_name: string
    email: string
    role: 'student' | 'parent'
    graduation_year?: number
    phone?: string
  }) => {
    // Create the basic profile first
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: profileData.email,
        full_name: profileData.full_name,
        role: profileData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { data: null, error: profileError }
    }

    // If it's a student, create a student record
    if (profileData.role === 'student' && profileData.graduation_year) {
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          id: userId,
          graduation_year: profileData.graduation_year,
          target_countries: [],
          intended_majors: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (studentError) {
        console.error('Error creating student record:', studentError)
      }
    }

    // If it's a parent, create a parent record
    if (profileData.role === 'parent') {
      const { error: parentError } = await supabase
        .from('parents')
        .insert({
          id: userId,
          phone: profileData.phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (parentError) {
        console.error('Error creating parent record:', parentError)
      }
    }

    return { data: profile, error: null }
  },

  // Get user profile
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  update: async (userId: string, updates: Partial<{
    full_name: string
    phone: string
    graduation_year: number
  }>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.full_name,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  }
}

// Helper functions for students
export const students = {
  // Get student record
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update student record
  update: async (userId: string, updates: Partial<{
    graduation_year: number
    gpa: number
    sat_score: number
    act_score: number
    target_countries: string[]
    intended_majors: string[]
    high_school: string
    counselor_name: string
    counselor_email: string
  }>) => {
    const { data, error } = await supabase
      .from('students')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  }
}

// Helper functions for parents
export const parents = {
  // Get parent record
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update parent record
  update: async (userId: string, updates: Partial<{
    phone: string
    occupation: string
  }>) => {
    const { data, error } = await supabase
      .from('parents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  }
}
