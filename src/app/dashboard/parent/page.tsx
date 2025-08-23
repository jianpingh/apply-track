'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Eye, 
  DollarSign, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  LogOut
} from 'lucide-react'
import { formatDate, formatCurrency, getDaysUntilDeadline, getDeadlineStatus, getStatusColor } from '@/lib/utils'

// Mock data - replace with real data from Supabase
const mockChildren = [
  {
    id: '1',
    name: 'John Smith',
    graduation_year: 2025,
    applications: [
      {
        id: '1',
        university: { name: 'Harvard University', tuition: 54269 },
        status: 'in_progress',
        deadline: '2024-11-01',
        financial_aid_requested: true,
        estimated_cost: 75000
      },
      {
        id: '2',
        university: { name: 'Stanford University', tuition: 58416 },
        status: 'submitted',
        deadline: '2025-01-02',
        financial_aid_requested: true,
        estimated_cost: 78000
      }
    ]
  }
]

const mockNotes = [
  {
    id: '1',
    text: 'Remind John to complete Harvard personal statement',
    application: 'Harvard University',
    created_at: '2024-10-15T10:00:00Z'
  },
  {
    id: '2',
    text: 'Contacted school counselor about recommendation letters',
    application: 'Stanford University',
    created_at: '2024-10-14T15:30:00Z'
  }
]

export default function ParentDashboard() {
  const router = useRouter()
  const [selectedChild, setSelectedChild] = useState(mockChildren[0])
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState(mockNotes)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const totalApplications = selectedChild.applications.length
  const submittedApplications = selectedChild.applications.filter(app => app.status === 'submitted').length
  const totalEstimatedCost = selectedChild.applications.reduce((sum, app) => sum + app.estimated_cost, 0)
  const urgentDeadlines = selectedChild.applications.filter(app => getDaysUntilDeadline(app.deadline) <= 7).length

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now().toString(),
        text: newNote,
        application: 'General Note',
        created_at: new Date().toISOString()
      }
      setNotes([note, ...notes])
      setNewNote('')
    }
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      // Clear any stored authentication data
      localStorage.removeItem('authToken')
      // Redirect to login page
      router.push('/auth/login')
    } catch (error) {
      console.error('Sign out error:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
              <p className="text-gray-600">Monitor {selectedChild.name}'s application progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                <p className="text-xs text-gray-500">Parent Account</p>
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
      </header>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Applied Schools</CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                {submittedApplications} submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Estimated Total Cost</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalEstimatedCost)}</div>
              <p className="text-xs text-muted-foreground">
                4-year estimate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Urgent Items</CardTitle>
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{urgentDeadlines}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((submittedApplications / totalApplications) * 100)}%</div>
              <p className="text-xs text-muted-foreground">
                Overall progress
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="applications">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="applications">Application Status</TabsTrigger>
                <TabsTrigger value="financial">Cost Planning</TabsTrigger>
                <TabsTrigger value="timeline">Important Dates</TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Application Details</h3>
                  <Badge variant="outline">{selectedChild.name} · Class of {selectedChild.graduation_year}</Badge>
                </div>

                <div className="space-y-4">
                  {selectedChild.applications.map((application) => {
                    const deadlineStatus = getDeadlineStatus(application.deadline)
                    
                    return (
                      <Card key={application.id} className="transition-shadow hover:shadow-md">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{application.university.name}</CardTitle>
                              <CardDescription>
                                Deadline: {formatDate(application.deadline)}
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
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Annual Tuition</p>
                              <p className="font-semibold">{formatCurrency(application.university.tuition)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Estimated Total Cost</p>
                              <p className="font-semibold">{formatCurrency(application.estimated_cost)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Financial Aid</p>
                              <p className="font-semibold">
                                {application.financial_aid_requested ? 'Yes' : 'No'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Application Status</p>
                              <p className="font-semibold">
                                {application.status === 'submitted' ? 'Submitted' : 'In Progress'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="financial">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Analysis</CardTitle>
                    <CardDescription>4-year university education cost estimate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedChild.applications.map((app) => (
                        <div key={app.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">{app.university.name}</h4>
                            <Badge variant="outline">
                              {app.financial_aid_requested ? 'Applied for Financial Aid' : 'No Financial Aid'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Annual Tuition:</span>
                              <span className="ml-2 font-medium">{formatCurrency(app.university.tuition)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Room & Board:</span>
                              <span className="ml-2 font-medium">{formatCurrency(15000)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Living Expenses:</span>
                              <span className="ml-2 font-medium">{formatCurrency(8000)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Other Fees:</span>
                              <span className="ml-2 font-medium">{formatCurrency(3000)}</span>
                            </div>
                          </div>
                          
                          <div className="pt-3 mt-3 border-t">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">4-Year Total Cost:</span>
                              <span className="text-lg font-bold text-blue-600">
                                {formatCurrency(app.estimated_cost)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="p-4 rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">Total Budget for All Schools:</span>
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(totalEstimatedCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Important Dates Timeline</CardTitle>
                    <CardDescription>Upcoming application deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedChild.applications
                        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                        .map((app) => {
                          const deadlineStatus = getDeadlineStatus(app.deadline)
                          const daysLeft = getDaysUntilDeadline(app.deadline)
                          
                          return (
                            <div key={app.id} className="flex items-center p-3 space-x-4 border rounded-lg">
                              <div className="flex-shrink-0">
                                {app.status === 'submitted' ? (
                                  <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : daysLeft <= 7 ? (
                                  <AlertCircle className="w-6 h-6 text-orange-500" />
                                ) : (
                                  <Clock className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{app.university.name}</p>
                                <p className="text-sm text-gray-500">Deadline: {formatDate(app.deadline)}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={deadlineStatus.color}>
                                  {daysLeft > 0 ? `${daysLeft} days` : daysLeft === 0 ? 'Today' : 'Overdue'}
                                </Badge>
                                <p className="mt-1 text-xs text-gray-500">
                                  {app.status === 'submitted' ? 'Submitted' : 'Pending'}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Note */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Add Note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Enter note content..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={handleAddNote} className="w-full" disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </CardContent>
            </Card>

            {/* Recent Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm">{note.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{note.application}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(note.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Communication Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Communication Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>This week's discussions</span>
                  <span className="font-medium">3 times</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Pending tasks</span>
                  <span className="font-medium">2 items</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Last updated</span>
                  <span className="font-medium">Today</span>
                </div>
                <Button variant="outline" className="w-full mt-3">
                  <FileText className="w-4 h-4 mr-2" />
                  View Detailed Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
