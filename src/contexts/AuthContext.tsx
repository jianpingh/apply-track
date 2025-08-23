'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, auth, profiles } from '@/lib/supabase'
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
      const { data: profileData, error } = await profiles.get(user.id)
      if (!error && profileData) {
        setProfile(profileData)
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
      const { data, error } = await auth.signUp(email, password, userData)
      
      if (error) {
        return { data, error }
      }

      if (data.user) {
        // Always try to create profile regardless of email confirmation status
        const profileData = {
          full_name: userData.full_name,
          email: email,
          role: userData.role,
          graduation_year: userData.graduation_year,
          phone: userData.phone
        }
        
        // Wait a moment for user to be fully created
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { error: profileError } = await profiles.create(data.user.id, profileData)
        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Don't return the profile error as the main error since user was created
          console.log('Profile will be created on first login')
        }
      }
      
      return { data, error }
    } catch (err) {
      console.error('SignUp error:', err)
      return { data: null, error: err as any }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await auth.signIn(email, password)
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
      setSession(null)
    }
    return { error }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session: initialSession } = await auth.getSession()
      
      if (initialSession) {
        setSession(initialSession)
        setUser(initialSession.user)
        
        // Load user profile
        const { data: profileData } = await profiles.get(initialSession.user.id)
        if (profileData) {
          setProfile(profileData)
        }
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Load user profile when logged in
          const { data: profileData } = await profiles.get(session.user.id)
          if (profileData) {
            setProfile(profileData)
          }
        } else {
          // Clear profile when logged out
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
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
