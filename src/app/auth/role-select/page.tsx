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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Apply Track</h1>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Apply Track
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Let's get started by understanding who you are. Choose your role to personalize your experience.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Student Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedRole === 'student' 
                ? 'ring-4 ring-blue-500 bg-blue-50 border-blue-200' 
                : 'hover:shadow-lg hover:-translate-y-2 bg-white'
            }`}
            onClick={() => handleRoleSelect('student')}
          >
            <CardHeader className="text-center pb-4">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                selectedRole === 'student' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
              } shadow-lg`}>
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                I am a Student
              </CardTitle>
              <p className="text-gray-600 leading-relaxed">
                I'm applying to universities and want to track my applications, deadlines, and requirements.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Track university applications</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Manage deadlines and requirements</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Share progress with parents</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>University search and comparison</span>
                </div>
              </div>
              {selectedRole === 'student' && (
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    ✓ Selected: Student Account
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parent Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedRole === 'parent' 
                ? 'ring-4 ring-purple-500 bg-purple-50 border-purple-200' 
                : 'hover:shadow-lg hover:-translate-y-2 bg-white'
            }`}
            onClick={() => handleRoleSelect('parent')}
          >
            <CardHeader className="text-center pb-4">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                selectedRole === 'parent' 
                  ? 'bg-purple-600' 
                  : 'bg-gradient-to-br from-purple-500 to-purple-600'
              } shadow-lg`}>
                <Users className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                I am a Parent
              </CardTitle>
              <p className="text-gray-600 leading-relaxed">
                I want to support and monitor my child's university application journey.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Monitor child's application progress</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Receive important notifications</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Add notes and reminders</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  <span>Collaborate with counselors</span>
                </div>
              </div>
              {selectedRole === 'parent' && (
                <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                  <p className="text-sm text-purple-800 font-medium">
                    ✓ Selected: Parent Account
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            size="lg"
            className={`px-12 py-4 text-lg font-semibold transition-all duration-200 ${
              selectedRole 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Registration
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Your Role?
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">For Students:</h4>
                <p className="text-gray-600 text-sm">
                  Get a personalized dashboard with application tracking, deadline management, 
                  and university research tools designed specifically for your needs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">For Parents:</h4>
                <p className="text-gray-600 text-sm">
                  Access oversight tools, communication features, and collaborative planning 
                  resources to support your child's journey effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
