'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        router.push('/auth/login?message=Auth error')
        return
      }

      if (data.session) {
        // User is authenticated, redirect to dashboard
        const userRole = data.session.user.user_metadata?.role
        if (userRole === 'student') {
          router.push('/dashboard/student')
        } else if (userRole === 'parent') {
          router.push('/dashboard/parent')
        } else {
          router.push('/dashboard/student') // default
        }
      } else {
        // No session, redirect to login
        router.push('/auth/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Confirming your account...</p>
      </div>
    </div>
  )
}
