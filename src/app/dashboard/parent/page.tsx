'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Eye, 
  DollarSign, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
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
  const [selectedChild, setSelectedChild] = useState(mockChildren[0])
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState(mockNotes)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
              <p className="text-gray-600">Monitor {selectedChild.name}'s application progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="rounded-md border border-gray-300 px-3 py-2">
                {mockChildren.map(child => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applied Schools</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                {submittedApplications} submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalEstimatedCost)}</div>
              <p className="text-xs text-muted-foreground">
                4-year estimate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Items</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{urgentDeadlines}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((submittedApplications / totalApplications) * 100)}%</div>
              <p className="text-xs text-muted-foreground">
                Overall progress
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="applications">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="applications">Application Status</TabsTrigger>
                <TabsTrigger value="financial">Cost Planning</TabsTrigger>
                <TabsTrigger value="timeline">Important Dates</TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Application Details</h3>
                  <Badge variant="outline">{selectedChild.name} · Class of {selectedChild.graduation_year}</Badge>
                </div>

                <div className="space-y-4">
                  {selectedChild.applications.map((application) => {
                    const deadlineStatus = getDeadlineStatus(application.deadline)
                    
                    return (
                      <Card key={application.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
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
                    <CardDescription>4-year college education cost estimate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedChild.applications.map((app) => (
                        <div key={app.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">{app.university.name}</h4>
                            <Badge variant="outline">
                              {app.financial_aid_requested ? 'Applied for Financial Aid' : 'No Financial Aid'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Annual Tuition:</span>
                              <span className="font-medium ml-2">{formatCurrency(app.university.tuition)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Room & Board:</span>
                              <span className="font-medium ml-2">{formatCurrency(15000)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Living Expenses:</span>
                              <span className="font-medium ml-2">{formatCurrency(8000)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Other Fees:</span>
                              <span className="font-medium ml-2">{formatCurrency(3000)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">4-Year Total Cost:</span>
                              <span className="text-lg font-bold text-blue-600">
                                {formatCurrency(app.estimated_cost)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
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
                            <div key={app.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                              <div className="flex-shrink-0">
                                {app.status === 'submitted' ? (
                                  <CheckCircle className="h-6 w-6 text-green-500" />
                                ) : daysLeft <= 7 ? (
                                  <AlertCircle className="h-6 w-6 text-orange-500" />
                                ) : (
                                  <Clock className="h-6 w-6 text-gray-400" />
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
                                <p className="text-xs text-gray-500 mt-1">
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
                  <MessageSquare className="h-5 w-5 mr-2" />
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
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{note.text}</p>
                    <div className="flex justify-between items-center mt-2">
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
                <div className="flex justify-between items-center text-sm">
                  <span>This week's discussions</span>
                  <span className="font-medium">3 times</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Pending tasks</span>
                  <span className="font-medium">2 items</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Last updated</span>
                  <span className="font-medium">Today</span>
                </div>
                <Button variant="outline" className="w-full mt-3">
                  <FileText className="h-4 w-4 mr-2" />
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
