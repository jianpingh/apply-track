'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Eye, EyeOff, User, Users, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type UserRole = 'student' | 'parent'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('student')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Get role from URL parameters
  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole
    if (roleParam && (roleParam === 'student' || roleParam === 'parent')) {
      setUserRole(roleParam)
    } else {
      // If no valid role is provided, redirect to role selection
      router.push('/auth/role-select')
    }
  }, [searchParams, router])
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    graduationYear: '',
    phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const userData = {
        full_name: formData.fullName,
        role: userRole,
        graduation_year: userRole === 'student' ? parseInt(formData.graduationYear) : undefined,
        phone: userRole === 'parent' ? formData.phone : undefined
      }

      const { data, error } = await signUp(formData.email, formData.password, userData)
      
      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        setSuccess('Account created successfully! You can now sign in with your credentials.')
        setTimeout(() => {
          router.push('/auth/login?message=Account created successfully. Please sign in.')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Signup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-10 h-10 mr-3 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Apply Track</h1>
          </div>
          
          {/* Role Display */}
          <div className="flex items-center justify-center mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${
              userRole === 'student' 
                ? 'border-blue-200 bg-blue-50 text-blue-700' 
                : 'border-purple-200 bg-purple-50 text-purple-700'
            }`}>
              {userRole === 'student' ? (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Student Account
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Parent Account
                </>
              )}
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Create Your Account</h2>
          <p className="text-gray-600 mb-4">
            {userRole === 'student' 
              ? 'Join thousands of students managing their university applications' 
              : 'Support your child\'s university application journey'
            }
          </p>
          
          {/* Back to Role Selection */}
          <Link 
            href="/auth/role-select" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Change role
          </Link>
        </div>

        {/* Signup Form */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center p-4 text-red-700 border border-red-200 rounded-lg bg-red-50">
                  <AlertCircle className="flex-shrink-0 w-5 h-5 mr-3" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center p-4 text-green-700 border border-green-200 rounded-lg bg-green-50">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mr-3" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Basic Information - Two columns */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Password Fields - Two columns */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      minLength={6}
                      className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-200 pr-12"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      minLength={6}
                      className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-200 pr-12"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role-specific Fields */}
              {userRole === 'student' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Graduation Year</label>
                  <Input
                    name="graduationYear"
                    type="number"
                    placeholder="e.g., 2025"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    min="2024"
                    max="2030"
                    className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
              )}

              {userRole === 'parent' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 underline">
                  Sign In
                </Link>
              </p>
              
              <Link href="/" className="inline-block text-sm text-gray-500 hover:text-gray-700">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
