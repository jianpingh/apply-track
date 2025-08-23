'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GraduationCap, Eye, EyeOff, User, Users, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type UserRole = 'student' | 'parent'

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('student')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    graduationYear: '',
    phone: '',
    relationship: 'father'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-10 w-10 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Apply Track</h1>
          </div>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Join Apply Track</CardTitle>
            <CardDescription>
              Choose your role and create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="parent" className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Parent
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center text-red-700">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center text-green-700">
                    <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                <TabsContent value="student" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

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
                    />
                  </div>
                </TabsContent>

                <TabsContent value="parent" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </TabsContent>

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
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    `Create ${userRole === 'student' ? 'Student' : 'Parent'} Account`
                  )}
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:underline">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
