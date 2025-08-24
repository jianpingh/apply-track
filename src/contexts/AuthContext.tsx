'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
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
          graduation_year: userData.graduation_year,
          phone: userData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        // Wait a moment for user to be fully created
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
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
              }
            } catch (err) {
              console.error('Error loading profile on auth change:', err)
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setProfile(null)
          
          // Clear cached data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('apply-track-user')
            localStorage.removeItem('apply-track-profile')
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
