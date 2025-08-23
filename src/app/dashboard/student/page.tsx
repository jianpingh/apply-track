'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  TrendingUp,
  BookOpen,
  Target,
  Bell,
  LogOut,
  User,
  Search
} from 'lucide-react'
import { formatDate, getDaysUntilDeadline, getDeadlineStatus, getStatusColor } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

// Mock data - replace with real data from Supabase
const mockApplications = [
  {
    id: '1',
    university: { name: 'Harvard University', short_name: 'Harvard' },
    application_type: 'early_action',
    status: 'in_progress',
    deadline: '2024-11-01',
    priority: 1,
    requirements_completed: 4,
    requirements_total: 7
  },
  {
    id: '2',
    university: { name: 'Stanford University', short_name: 'Stanford' },
    application_type: 'regular_decision',
    status: 'not_started',
    deadline: '2025-01-02',
    priority: 2,
    requirements_completed: 1,
    requirements_total: 6
  },
  {
    id: '3',
    university: { name: 'MIT', short_name: 'MIT' },
    application_type: 'early_action',
    status: 'submitted',
    deadline: '2024-11-01',
    priority: 1,
    requirements_completed: 8,
    requirements_total: 8
  }
]

const mockUpcomingTasks = [
  {
    id: '1',
    title: 'Complete Harvard personal statement',
    deadline: '2024-10-25',
    type: 'essay',
    university: 'Harvard University'
  },
  {
    id: '2',
    title: 'Submit SAT scores to Stanford',
    deadline: '2024-10-30',
    type: 'test_scores',
    university: 'Stanford University'
  },
  {
    id: '3',
    title: 'Request recommendation letter - MIT',
    deadline: '2024-10-28',
    type: 'recommendation_letter',
    university: 'MIT'
  }
]

export default function StudentDashboard() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState(mockApplications)
  const [upcomingTasks, setUpcomingTasks] = useState(mockUpcomingTasks)
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Calculate statistics
  const totalApplications = applications.length
  const submittedApplications = applications.filter(app => app.status === 'submitted').length
  const urgentDeadlines = applications.filter(app => getDaysUntilDeadline(app.deadline) <= 7).length
  const overallProgress = applications.reduce((acc, app) => acc + (app.requirements_completed / app.requirements_total), 0) / applications.length * 100

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Sign out error:', error)
      } else {
        router.push('/')
      }
    } catch (err) {
      console.error('Sign out failed:', err)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile?.full_name || user?.email || 'Student'}! Manage your university application progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-400" />
              
              {/* User Profile Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{profile?.full_name || user?.email || 'Student'}</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      Signing out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Add Application Card - Featured Position */}
          <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-400 transition-all duration-200 cursor-pointer group"
                onClick={() => router.push('/dashboard/student/add-application')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Add New Application</CardTitle>
              <Plus className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-800 mb-1">Start Applying</div>
              <p className="text-xs text-blue-600">
                Search universities and begin your application journey
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submittedApplications}</div>
              <p className="text-xs text-muted-foreground">
                {((submittedApplications / totalApplications) * 100).toFixed(0)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Deadlines</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{urgentDeadlines}</div>
              <p className="text-xs text-muted-foreground">
                Due within 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress.toFixed(0)}%</div>
              <Progress value={overallProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="applications">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="applications">My Applications</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Application Status</h3>
                  <Button variant="outline" size="sm">Filter</Button>
                </div>

                <div className="space-y-4">
                  {applications.map((application) => {
                    const deadlineStatus = getDeadlineStatus(application.deadline)
                    const progressPercentage = (application.requirements_completed / application.requirements_total) * 100

                    return (
                      <Card key={application.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{application.university.name}</CardTitle>
                              <CardDescription>
                                {application.application_type === 'early_action' ? 'Early Action' : 
                                 application.application_type === 'early_decision' ? 'Early Decision' : 'Regular Decision'}
                              </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(application.status)}>
                                {application.status === 'not_started' ? 'Not Started' :
                                 application.status === 'in_progress' ? 'In Progress' :
                                 application.status === 'submitted' ? 'Submitted' : application.status}
                              </Badge>
                              <Badge variant="outline" className={deadlineStatus.color}>
                                {getDaysUntilDeadline(application.deadline)} days
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span>Deadline: {formatDate(application.deadline)}</span>
                              <span>Priority: P{application.priority}</span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Application Materials Progress</span>
                                <span>{application.requirements_completed}/{application.requirements_total}</span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              <Button variant="outline" size="sm">View Details</Button>
                              <Button size="sm">Continue Application</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Timeline</CardTitle>
                    <CardDescription>Important dates and milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.map((app, index) => (
                        <div key={app.id} className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              app.status === 'submitted' ? 'bg-green-500' : 
                              app.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{app.university.short_name}</p>
                            <p className="text-sm text-gray-500">{formatDate(app.deadline)}</p>
                          </div>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status === 'submitted' ? 'Submitted' : 
                             app.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.map((task) => {
                  const deadlineStatus = getDeadlineStatus(task.deadline)
                  
                  return (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{task.university}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${deadlineStatus.color}`}>
                          {formatDate(task.deadline)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {task.type === 'essay' ? 'Essay' :
                           task.type === 'test_scores' ? 'Test Scores' :
                           task.type === 'recommendation_letter' ? 'Recommendation' : task.type}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Application
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Search Universities
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle>This Week's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed Tasks</span>
                    <span className="font-medium">3/7</span>
                  </div>
                  <Progress value={42} />
                  <p className="text-xs text-gray-500">
                    4 more tasks to complete
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
