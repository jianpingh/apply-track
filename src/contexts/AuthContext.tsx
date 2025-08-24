'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type StudentProfile = Database['public']['Tables']['students']['Row']
type ParentProfile = Database['public']['Tables']['parents']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  studentProfile: StudentProfile | null
  parentProfile: ParentProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: {
    full_name: string
    role: 'student' | 'parent'
    graduation_year?: number
    phone?: string
  }) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (user) {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (!error && profileData) {
          setProfile(profileData)
          
          // Load additional profile data based on role
          if ((profileData as any)?.role === 'student') {
            const { data: studentData } = await supabase
              .from('students')
              .select('*')
              .eq('id', user.id)
              .single()
            
            if (studentData) {
              setStudentProfile(studentData)
            }
          } else if ((profileData as any)?.role === 'parent') {
            const { data: parentData } = await supabase
              .from('parents')
              .select('*')
              .eq('id', user.id)
              .single()
            
            if (parentData) {
              setParentProfile(parentData)
            }
          }
        }
      } catch (error) {
        console.error('Error refreshing profile:', error)
      }
    }
  }

  const signUp = async (email: string, password: string, userData: {
    full_name: string
    role: 'student' | 'parent'
    graduation_year?: number
    phone?: string
  }) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        return { data, error }
      }

      if (data.user) {
        // Create profile in database
        const profileData = {
          id: data.user.id,
          email: email,
          full_name: userData.full_name,
          role: userData.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        // Wait a moment for user to be fully created
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData as any)
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
        } else {
          // Create role-specific profile
          if (userData.role === 'student' && userData.graduation_year) {
            const { error: studentError } = await supabase
              .from('students')
              .insert({
                id: data.user.id,
                graduation_year: userData.graduation_year,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              } as any)
            
            if (studentError) {
              console.error('Error creating student profile:', studentError)
            }
          } else if (userData.role === 'parent' && userData.phone) {
            const { error: parentError } = await supabase
              .from('parents')
              .insert({
                id: data.user.id,
                phone: userData.phone,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              } as any)
            
            if (parentError) {
              console.error('Error creating parent profile:', parentError)
            }
          }
        }
      }
      
      return { data, error }
    } catch (err) {
      console.error('SignUp error:', err)
      return { data: null, error: err as any }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { data, error }
      }

      // Wait for auth state to be properly set
      if (data.session) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      return { data, error }
    } catch (err) {
      console.error('SignIn error:', err)
      return { data: null, error: err as any }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (!error) {
        setUser(null)
        setProfile(null)
        setStudentProfile(null)
        setParentProfile(null)
        setSession(null)
        
        // Clear any cached data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('apply-track-user')
          localStorage.removeItem('apply-track-profile')
        }
      }
      
      return { error }
    } catch (err) {
      console.error('SignOut error:', err)
      return { error: err as any }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          if (isMounted) setLoading(false)
          return
        }
        
        if (initialSession && isMounted) {
          console.log('Found existing session:', initialSession.user.email)
          setSession(initialSession)
          setUser(initialSession.user)
          
          // Load user profile
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', initialSession.user.id)
              .single()
              
            if (!profileError && profileData && isMounted) {
              setProfile(profileData)
              
              // Load additional profile data based on role
              if ((profileData as any)?.role === 'student') {
                const { data: studentData } = await supabase
                  .from('students')
                  .select('*')
                  .eq('id', initialSession.user.id)
                  .single()
                
                if (studentData) {
                  setStudentProfile(studentData)
                }
              } else if ((profileData as any)?.role === 'parent') {
                const { data: parentData } = await supabase
                  .from('parents')
                  .select('*')
                  .eq('id', initialSession.user.id)
                  .single()
                
                if (parentData) {
                  setParentProfile(parentData)
                }
              }
            }
          } catch (profileErr) {
            console.error('Error loading profile:', profileErr)
          }
        }
        
        if (isMounted) {
          setLoading(false)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (isMounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'no user')
        
        if (!isMounted) return

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            setSession(session)
            setUser(session.user)
            
            // Load user profile
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()
                
              if (!profileError && profileData) {
                setProfile(profileData)
                
                // Load additional profile data based on role
                if ((profileData as any)?.role === 'student') {
                  const { data: studentData } = await supabase
                    .from('students')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                  
                  if (studentData) {
                    setStudentProfile(studentData)
                  }
                } else if ((profileData as any)?.role === 'parent') {
                  const { data: parentData } = await supabase
                    .from('parents')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                  
                  if (parentData) {
                    setParentProfile(parentData)
                  }
                }
              }
            } catch (err) {
              console.error('Error loading profile on auth change:', err)
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setProfile(null)
          setStudentProfile(null)
          setParentProfile(null)
          
          // Clear cached data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('apply-track-user')
            localStorage.removeItem('apply-track-profile')
            localStorage.removeItem('apply-track-student-profile')
            localStorage.removeItem('apply-track-parent-profile')
          }
        }
        
        setLoading(false)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    user,
    profile,
    studentProfile,
    parentProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
