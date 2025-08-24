'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError('Authentication failed. Please try logging in again.')
          setTimeout(() => {
            router.push('/auth/login?message=Auth error')
          }, 2000)
          return
        }

        if (data.session) {
          console.log('Auth callback successful for:', data.session.user.email)
          
          // User is authenticated, determine redirect destination
          let redirectPath = '/dashboard/student' // default
          
          try {
            // Try to get user profile for role-based redirect
            const { data: profileData } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.session.user.id)
              .single()
            
            if (profileData) {
              const role = (profileData as { role: string }).role
              if (role === 'parent') {
                redirectPath = '/dashboard/parent'
              } else if (role === 'student') {
                redirectPath = '/dashboard/student'
              }
            }
          } catch (profileError) {
            console.log('Profile not found, using user metadata')
            // Fallback to user metadata
            const userRole = data.session.user.user_metadata?.role
            if (userRole === 'parent') {
              redirectPath = '/dashboard/parent'
            }
          }
          
          // Small delay to ensure auth state is properly set
          setTimeout(() => {
            router.push(redirectPath)
          }, 500)
        } else {
          // No session found
          console.log('No session found in callback')
          setError('No authentication session found.')
          setTimeout(() => {
            router.push('/auth/login')
          }, 2000)
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        setError('An unexpected error occurred.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } finally {
        setIsProcessing(false)
      }
    }

    // Small delay to ensure proper URL parsing
    const timer = setTimeout(handleAuthCallback, 100)
    
    return () => clearTimeout(timer)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Processing Authentication</h2>
            <p className="text-gray-600">Please wait while we confirm your account...</p>
          </>
        ) : error ? (
          <>
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Authentication Error</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <div className="text-green-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Authentication Successful</h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </>
        )}
      </div>
    </div>
  )
}
