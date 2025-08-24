'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Users, ArrowRight, CheckCircle } from 'lucide-react'

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent' | null>(null)
  const router = useRouter()

  const handleRoleSelect = (role: 'student' | 'parent') => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/auth/signup?role=${selectedRole}`)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-10 h-10 mr-3 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Apply Track</h1>
          </div>
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Who are you?
          </h2>
          <p className="max-w-lg mx-auto text-lg text-gray-600">
            Choose your role to get started with your personalized experience.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid gap-6 mb-12 md:grid-cols-2">
          {/* Student Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 border-2 ${
              selectedRole === 'student' 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
            }`}
            onClick={() => handleRoleSelect('student')}
          >
            <CardContent className="p-8 text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${
                selectedRole === 'student' 
                  ? 'bg-blue-600' 
                  : 'bg-blue-500'
              } transition-colors duration-200`}>
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Student
              </h3>
              <p className="mb-6 text-gray-600">
                Track applications, manage deadlines, and discover universities.
              </p>
              {selectedRole === 'student' && (
                <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Selected
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parent Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 border-2 ${
              selectedRole === 'parent' 
                ? 'border-purple-500 bg-purple-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
            }`}
            onClick={() => handleRoleSelect('parent')}
          >
            <CardContent className="p-8 text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${
                selectedRole === 'parent' 
                  ? 'bg-purple-600' 
                  : 'bg-purple-500'
              } transition-colors duration-200`}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Parent
              </h3>
              <p className="mb-6 text-gray-600">
                Support and monitor your child's application journey.
              </p>
              {selectedRole === 'parent' && (
                <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Selected
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-6 text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            size="lg"
            className={`px-8 py-3 text-base font-medium transition-all duration-200 ${
              selectedRole 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 underline hover:text-blue-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
