'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthTest() {
  const { user, profile, session, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication state...</p>
        </div>
      </div>
    )
  }

  // Show not authenticated state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Not Authenticated</h1>
          <p className="text-gray-600 mb-4">You are not logged in.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Show authenticated state
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        {/* User Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-700">Email:</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">User ID:</label>
              <p className="text-gray-900 text-sm">{user.id}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Email Verified:</label>
              <p className="text-gray-900">{user.email_confirmed_at ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Last Sign In:</label>
              <p className="text-gray-900">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          {profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-700">Full Name:</label>
                <p className="text-gray-900">{profile.full_name}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Role:</label>
                <p className="text-gray-900 capitalize">{profile.role}</p>
              </div>
              {profile.graduation_year && (
                <div>
                  <label className="font-medium text-gray-700">Graduation Year:</label>
                  <p className="text-gray-900">{profile.graduation_year}</p>
                </div>
              )}
              {profile.phone && (
                <div>
                  <label className="font-medium text-gray-700">Phone:</label>
                  <p className="text-gray-900">{profile.phone}</p>
                </div>
              )}
              <div>
                <label className="font-medium text-gray-700">Created:</label>
                <p className="text-gray-900">{profile.created_at ? new Date(profile.created_at).toLocaleString() : 'Unknown'}</p>
              </div>
            </div>
          ) : (
            <p className="text-yellow-600">Profile not loaded or not found</p>
          )}
        </div>

        {/* Session Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          {session ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-700">Access Token (first 20 chars):</label>
                <p className="text-gray-900 text-sm">{session.access_token.substring(0, 20)}...</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Token Type:</label>
                <p className="text-gray-900">{session.token_type}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Expires At:</label>
                <p className="text-gray-900">{session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Unknown'}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Refresh Token (first 20 chars):</label>
                <p className="text-gray-900 text-sm">{session.refresh_token?.substring(0, 20)}...</p>
              </div>
            </div>
          ) : (
            <p className="text-red-600">No session found</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push(profile?.role === 'parent' ? '/dashboard/parent' : '/dashboard/student')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
