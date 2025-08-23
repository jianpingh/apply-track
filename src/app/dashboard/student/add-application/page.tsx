'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  ArrowLeft,
  Star,
  Building,
  MapPin,
  BookOpen,
  CheckCircle,
  Users,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Award,
  Globe,
  Heart,
  Filter,
  FileText,
  TrendingUp
} from 'lucide-react'

// Enhanced Mock data with images and descriptions
const universitiesData = [
  {
    id: '1',
    name: 'Harvard University',
    short_name: 'Harvard',
    city: 'Cambridge',
    state: 'Massachusetts',
    us_news_ranking: 2,
    acceptance_rate: 3.4,
    tuition_out_state: 54269,
    application_fee: 85,
    application_system: 'Common App',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop&crop=center',
    description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, Harvard is the oldest institution of higher education in the United States and one of the most prestigious universities worldwide.',
    founded: 1636,
    student_body: 23000,
    campus_size: '5,076 acres',
    notable_alumni: ['Barack Obama', 'Mark Zuckerberg', 'John Adams'],
    popular_majors: ['Economics', 'Computer Science', 'Government', 'Psychology', 'Biology'],
    deadlines: {
      early_action: '2024-11-01',
      regular_decision: '2025-01-01'
    },
    requirements: [
      'Common Application',
      'High School Transcript',
      'SAT/ACT Scores',
      '2 Teacher Recommendations',
      'Counselor Recommendation',
      'Personal Essay',
      'Supplemental Essays'
    ],
    highlights: ['#1 Law School', 'World-renowned Faculty', 'Largest University Endowment']
  },
  {
    id: '2',
    name: 'Stanford University',
    short_name: 'Stanford',
    city: 'Stanford',
    state: 'California',
    us_news_ranking: 6,
    acceptance_rate: 3.9,
    tuition_out_state: 58416,
    application_fee: 90,
    application_system: 'Common App',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center',
    description: 'Stanford University is a private research university in Stanford, California. Known for its academic strength, wealth, proximity to Silicon Valley, and ranking as one of the world\'s top universities.',
    founded: 1885,
    student_body: 17000,
    campus_size: '8,180 acres',
    notable_alumni: ['Elon Musk', 'Larry Page', 'John F. Kennedy'],
    popular_majors: ['Computer Science', 'Engineering', 'Economics', 'Biology', 'Psychology'],
    deadlines: {
      early_action: '2024-11-01',
      regular_decision: '2025-01-02'
    },
    requirements: [
      'Common Application',
      'High School Transcript',
      'SAT/ACT Scores',
      '2 Teacher Recommendations',
      'Counselor Recommendation',
      'Personal Essay',
      'Supplemental Essays'
    ],
    highlights: ['Silicon Valley Location', 'Top Engineering Programs', 'Entrepreneurship Hub']
  },
  {
    id: '3',
    name: 'Massachusetts Institute of Technology',
    short_name: 'MIT',
    city: 'Cambridge',
    state: 'Massachusetts',
    us_news_ranking: 2,
    acceptance_rate: 6.7,
    tuition_out_state: 57986,
    application_fee: 85,
    application_system: 'MIT Application',
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&h=400&fit=crop&crop=center',
    description: 'MIT is a private research university in Cambridge, Massachusetts. The institute emphasizes scientific and technological research and is known for its innovation and academic excellence.',
    founded: 1861,
    student_body: 11000,
    campus_size: '168 acres',
    notable_alumni: ['Buzz Aldrin', 'Richard Feynman', 'Tim Berners-Lee'],
    popular_majors: ['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Economics'],
    deadlines: {
      early_action: '2024-11-01',
      regular_decision: '2025-01-01'
    },
    requirements: [
      'MIT Application',
      'High School Transcript',
      'SAT/ACT Scores',
      '2 Teacher Recommendations (Math/Science)',
      'Counselor Recommendation',
      '5 Short Essays',
      'Interview (if available)'
    ],
    highlights: ['#1 Engineering School', 'Innovation Leader', 'Tech Startup Incubator']
  },
  {
    id: '4',
    name: 'University of California, Berkeley',
    short_name: 'UC Berkeley',
    city: 'Berkeley',
    state: 'California',
    us_news_ranking: 22,
    acceptance_rate: 14.5,
    tuition_out_state: 48465,
    application_fee: 80,
    application_system: 'UC Application',
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&h=400&fit=crop&crop=center',
    description: 'UC Berkeley is a public research university in Berkeley, California. It is the flagship institution of the University of California system and one of the most prestigious public universities in the world.',
    founded: 1868,
    student_body: 45000,
    campus_size: '1,232 acres',
    notable_alumni: ['Steve Wozniak', 'Eric Schmidt', 'Jennifer Granholm'],
    popular_majors: ['Computer Science', 'Engineering', 'Business', 'Economics', 'Political Science'],
    deadlines: {
      regular_decision: '2024-11-30'
    },
    requirements: [
      'UC Application',
      'High School Transcript',
      'SAT/ACT Scores (optional)',
      'Personal Insight Questions (4 essays)',
      'Activities List'
    ],
    highlights: ['Top Public University', 'Research Excellence', 'Diverse Student Body']
  },
  {
    id: '5',
    name: 'Yale University',
    short_name: 'Yale',
    city: 'New Haven',
    state: 'Connecticut',
    us_news_ranking: 4,
    acceptance_rate: 4.6,
    tuition_out_state: 62250,
    application_fee: 80,
    application_system: 'Common App',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=400&fit=crop&crop=center',
    description: 'Yale University is a private Ivy League research university in New Haven, Connecticut. Founded in 1701, Yale is known for its outstanding undergraduate program and its secret societies.',
    founded: 1701,
    student_body: 13500,
    campus_size: '310 acres',
    notable_alumni: ['George W. Bush', 'Hillary Clinton', 'Meryl Streep'],
    popular_majors: ['Economics', 'Political Science', 'History', 'Psychology', 'Biology'],
    deadlines: {
      early_action: '2024-11-01',
      regular_decision: '2025-01-02'
    },
    requirements: [
      'Common Application',
      'High School Transcript',
      'SAT/ACT Scores',
      '2 Teacher Recommendations',
      'Counselor Recommendation',
      'Personal Essay',
      'Supplemental Essays'
    ],
    highlights: ['Gothic Architecture', 'Residential College System', 'Strong Alumni Network']
  },
  {
    id: '6',
    name: 'Princeton University',
    short_name: 'Princeton',
    city: 'Princeton',
    state: 'New Jersey',
    us_news_ranking: 1,
    acceptance_rate: 3.9,
    tuition_out_state: 59710,
    application_fee: 75,
    application_system: 'Common App',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&crop=center',
    description: 'Princeton University is a private Ivy League research university in Princeton, New Jersey. Founded in 1746, Princeton is known for its undergraduate focus and beautiful campus.',
    founded: 1746,
    student_body: 5400,
    campus_size: '600 acres',
    notable_alumni: ['Woodrow Wilson', 'F. Scott Fitzgerald', 'Jeff Bezos'],
    popular_majors: ['Economics', 'Computer Science', 'Public Policy', 'History', 'Mathematics'],
    deadlines: {
      early_action: '2024-11-01',
      regular_decision: '2025-01-01'
    },
    requirements: [
      'Common Application',
      'High School Transcript',
      'SAT/ACT Scores',
      '2 Teacher Recommendations',
      'Counselor Recommendation',
      'Personal Essay',
      'Supplemental Essays'
    ],
    highlights: ['#1 National University', 'Beautiful Campus', 'Small Class Sizes']
  }
]

export default function AddApplicationPage() {
  const router = useRouter()
  const [selectedUniversity, setSelectedUniversity] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentStep, setCurrentStep] = useState('browse') // 'browse' or 'apply'
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(true)
  const itemsPerPage = 3
  const [filters, setFilters] = useState({
    state: '',
    ranking: '',
    acceptanceRate: '',
    major: ''
  })
  const [applicationData, setApplicationData] = useState({
    application_type: 'regular_decision',
    priority: 1,
    major: '',
    graduation_year: '',
    personal_statement: '',
    notes: ''
  })

  const filteredUniversities = universitiesData.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.popular_majors.some(major => major.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesState = !filters.state || uni.state === filters.state
    const matchesRanking = !filters.ranking || 
      (filters.ranking === 'top10' && uni.us_news_ranking <= 10) ||
      (filters.ranking === 'top25' && uni.us_news_ranking <= 25) ||
      (filters.ranking === 'top50' && uni.us_news_ranking <= 50)
    
    const matchesAcceptance = !filters.acceptanceRate ||
      (filters.acceptanceRate === 'low' && uni.acceptance_rate < 10) ||
      (filters.acceptanceRate === 'medium' && uni.acceptance_rate >= 10 && uni.acceptance_rate < 25) ||
      (filters.acceptanceRate === 'high' && uni.acceptance_rate >= 25)
    
    const matchesMajor = !filters.major || uni.popular_majors.some(major => 
      major.toLowerCase().includes(filters.major.toLowerCase())
    )

    return matchesSearch && matchesState && matchesRanking && matchesAcceptance && matchesMajor
  })

  // Pagination
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUniversities = filteredUniversities.slice(startIndex, startIndex + itemsPerPage)

  const handleSelectUniversity = (university) => {
    setSelectedUniversity(university)
    setCurrentStep('apply')
  }

  const handleAddApplication = (e) => {
    e.preventDefault()
    if (selectedUniversity) {
      console.log('Adding application:', {
        university: selectedUniversity,
        ...applicationData,
        created_at: new Date().toISOString(),
        status: 'draft'
      })
      // Reset form
      setApplicationData({
        application_type: 'regular_decision',
        priority: 1,
        major: '',
        graduation_year: '',
        personal_statement: '',
        notes: ''
      })
      // Show success message or redirect
      alert(`Application for ${selectedUniversity.name} has been added to your dashboard!`)
      router.push('/dashboard/student')
    }
  }

  const resetFilters = () => {
    setFilters({
      state: '',
      ranking: '',
      acceptanceRate: '',
      major: ''
    })
    setSearchTerm('')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentStep === 'browse' ? 'Discover Universities' : 'Configure Application'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentStep === 'browse' 
                    ? `Explore ${filteredUniversities.length} universities and find your perfect match`
                    : `Complete your application for ${selectedUniversity?.name}`
                  }
                </p>
              </div>
            </div>
            {currentStep === 'apply' && (
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setCurrentStep('browse')}>
                  Back to Browse
                </Button>
                <Button onClick={handleAddApplication} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Add to My Applications
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'browse' ? (
          <div>
            {/* Search and Filter Section */}
            <div className="mb-8">
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          placeholder="Search universities, cities, majors..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                          }}
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:w-auto w-full"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    {(searchTerm || Object.values(filters).some(f => f)) && (
                      <Button variant="outline" onClick={resetFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                  
                  {showFilters && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <Select value={filters.state} onChange={(e) => {
                            setFilters(prev => ({...prev, state: e.target.value}))
                            setCurrentPage(1)
                          }}>
                            <option value="">All States</option>
                            <option value="California">California</option>
                            <option value="Massachusetts">Massachusetts</option>
                            <option value="Connecticut">Connecticut</option>
                            <option value="New Jersey">New Jersey</option>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ranking</label>
                          <Select value={filters.ranking} onChange={(e) => {
                            setFilters(prev => ({...prev, ranking: e.target.value}))
                            setCurrentPage(1)
                          }}>
                            <option value="">All Rankings</option>
                            <option value="top10">Top 10</option>
                            <option value="top25">Top 25</option>
                            <option value="top50">Top 50</option>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Selectivity</label>
                          <Select value={filters.acceptanceRate} onChange={(e) => {
                            setFilters(prev => ({...prev, acceptanceRate: e.target.value}))
                            setCurrentPage(1)
                          }}>
                            <option value="">All Types</option>
                            <option value="low">Highly Selective (&lt;10%)</option>
                            <option value="medium">Selective (10-25%)</option>
                            <option value="high">Less Selective (&gt;25%)</option>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Major Interest</label>
                          <Input
                            placeholder="e.g. Computer Science"
                            value={filters.major}
                            onChange={(e) => {
                              setFilters(prev => ({...prev, major: e.target.value}))
                              setCurrentPage(1)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Summary */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUniversities.length)} of {filteredUniversities.length} universities
              </p>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Universities Grid */}
            <div className="space-y-6 mb-8">
              {paginatedUniversities.map((university) => (
                <Card key={university.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{university.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800 font-semibold">
                              #{university.us_news_ranking} US News
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span>{university.city}, {university.state}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="h-4 w-4 text-green-500" />
                            <span>Founded {university.founded}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span>{university.student_body.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Globe className="h-4 w-4 text-orange-500" />
                            <span>{university.campus_size}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{university.description}</p>
                      </div>
                    </div>

                    {/* Popular Academic Programs and Action Button Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <BookOpen className="h-4 w-4 mr-1 text-slate-500" />
                          Popular Academic Programs
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {university.popular_majors.slice(0, 4).map((major) => (
                            <Badge key={major} className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-xs">
                              {major}
                            </Badge>
                          ))}
                          {university.popular_majors.length > 4 && (
                            <Badge className="bg-gray-50 text-gray-500 text-xs">
                              +{university.popular_majors.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Button 
                          onClick={() => handleSelectUniversity(university)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Start Application Process
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-24 h-10 flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center ${
                        currentPage === page ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-20 h-10 flex items-center justify-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Application Configuration Step
          <div className="max-w-7xl mx-auto">
            {selectedUniversity && (
              <div className="space-y-6">
                {/* University Header */}
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-4xl font-bold mb-2 text-gray-800">{selectedUniversity.name}</CardTitle>
                        <CardDescription className="text-xl text-gray-600 mb-4">
                          {selectedUniversity.city}, {selectedUniversity.state} • Founded {selectedUniversity.founded}
                        </CardDescription>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{selectedUniversity.city}, {selectedUniversity.state}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4" />
                            <span>Founded {selectedUniversity.founded}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{selectedUniversity.student_body.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4" />
                            <span>{selectedUniversity.campus_size}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed max-w-4xl text-lg">{selectedUniversity.description}</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700 border border-gray-300 font-semibold text-lg px-4 py-2">
                        #{selectedUniversity.us_news_ranking} US News
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  {/* Statistics Grid */}
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-600 text-white rounded-full mb-3">
                          <Users className="h-6 w-6" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Acceptance Rate</p>
                        <p className="text-3xl font-bold text-gray-800">{selectedUniversity.acceptance_rate}%</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedUniversity.acceptance_rate < 10 ? 'Highly Selective' : 
                           selectedUniversity.acceptance_rate < 25 ? 'Selective' : 'Moderately Selective'}
                        </p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-200">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full mb-3">
                          <DollarSign className="h-6 w-6" />
                        </div>
                        <p className="text-sm text-emerald-700 font-medium mb-1">Annual Tuition</p>
                        <p className="text-3xl font-bold text-emerald-800">${selectedUniversity.tuition_out_state.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600 mt-1">Out-of-State</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-600 text-white rounded-full mb-3">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Application Fee</p>
                        <p className="text-3xl font-bold text-gray-800">${selectedUniversity.application_fee}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedUniversity.application_system}</p>
                      </div>
                    </div>

                    {/* Detailed Information Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {/* Notable Alumni */}
                      <Card className="border-l-4 border-l-amber-300 shadow-sm">
                        <CardContent className="p-6">
                          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Star className="h-6 w-6 mr-3 text-amber-500" />
                            Notable Alumni
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedUniversity.notable_alumni.map((alumni) => (
                              <Badge key={alumni} className="bg-amber-50 border-amber-200 text-amber-800 px-4 py-2 text-sm">
                                {alumni}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Popular Majors */}
                      <Card className="border-l-4 border-l-slate-300 shadow-sm">
                        <CardContent className="p-6">
                          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <BookOpen className="h-6 w-6 mr-3 text-slate-500" />
                            Popular Academic Programs
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedUniversity.popular_majors.map((major) => (
                              <Badge key={major} className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors px-4 py-2 text-sm">
                                {major}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Key Highlights */}
                      <Card className="border-l-4 border-l-emerald-300 shadow-sm">
                        <CardContent className="p-6">
                          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Award className="h-6 w-6 mr-3 text-emerald-500" />
                            Key Strengths & Highlights
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedUniversity.highlights.map((highlight) => (
                              <Badge key={highlight} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 text-sm">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Application Deadlines */}
                      <Card className="border-l-4 border-l-rose-300 shadow-sm">
                        <CardContent className="p-6">
                          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Calendar className="h-6 w-6 mr-3 text-rose-500" />
                            Application Deadlines
                          </h4>
                          <div className="space-y-3">
                            {selectedUniversity.deadlines.early_action && (
                              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                                <p className="font-semibold text-rose-800 text-lg">Early Action</p>
                                <p className="text-rose-600">{selectedUniversity.deadlines.early_action}</p>
                              </div>
                            )}
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                              <p className="font-semibold text-slate-800 text-lg">Regular Decision</p>
                              <p className="text-slate-600">{selectedUniversity.deadlines.regular_decision}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Settings */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Application Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure your application settings for {selectedUniversity.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Application Type</label>
                        <Select 
                          value={applicationData.application_type} 
                          onChange={(e) => setApplicationData(prev => ({...prev, application_type: e.target.value}))}
                        >
                          {selectedUniversity.deadlines.early_action && (
                            <option value="early_action">
                              Early Action - Deadline: {selectedUniversity.deadlines.early_action}
                            </option>
                          )}
                          <option value="regular_decision">
                            Regular Decision - Deadline: {selectedUniversity.deadlines.regular_decision}
                          </option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                        <Select 
                          value={applicationData.priority} 
                          onChange={(e) => setApplicationData(prev => ({...prev, priority: parseInt(e.target.value)}))}
                        >
                          <option value={1}>High Priority (Dream School)</option>
                          <option value={2}>Medium Priority (Target School)</option>
                          <option value={3}>Low Priority (Safety School)</option>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements Checklist */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Application Requirements
                    </CardTitle>
                    <CardDescription>
                      Complete these requirements to submit your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUniversity.requirements.map((req, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{req}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-slate-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-1">Application System</h4>
                          <p className="text-sm text-slate-700">
                            This university uses <strong>{selectedUniversity.application_system}</strong>. 
                            Make sure you have an account set up before starting your application.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Configuration Form */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <FileText className="h-6 w-6 mr-3 text-slate-600" />
                      Configure Your Application
                    </CardTitle>
                    <CardDescription className="text-base">
                      Set up your application preferences and add personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddApplication} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Major
                          </label>
                          <Select 
                            value={applicationData.major || ''} 
                            onChange={(e) => setApplicationData(prev => ({...prev, major: e.target.value}))}
                            className="w-full"
                          >
                            <option value="">Select your preferred major</option>
                            {selectedUniversity.popular_majors.map((major) => (
                              <option key={major} value={major}>{major}</option>
                            ))}
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Application Type
                          </label>
                          <Select 
                            value={applicationData.application_type} 
                            onChange={(e) => setApplicationData(prev => ({...prev, application_type: e.target.value}))}
                            className="w-full"
                          >
                            {selectedUniversity.deadlines.early_action && (
                              <option value="early_action">Early Action - {selectedUniversity.deadlines.early_action}</option>
                            )}
                            <option value="regular_decision">Regular Decision - {selectedUniversity.deadlines.regular_decision}</option>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority Level
                          </label>
                          <Select 
                            value={applicationData.priority} 
                            onChange={(e) => setApplicationData(prev => ({...prev, priority: parseInt(e.target.value)}))}
                            className="w-full"
                          >
                            <option value={1}>🎯 High Priority (Dream School)</option>
                            <option value={2}>📚 Medium Priority (Target School)</option>
                            <option value={3}>✅ Low Priority (Safety School)</option>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expected Graduation Year
                          </label>
                          <Select 
                            value={applicationData.graduation_year || ''} 
                            onChange={(e) => setApplicationData(prev => ({...prev, graduation_year: e.target.value}))}
                            className="w-full"
                          >
                            <option value="">Select graduation year</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                            <option value="2031">2031</option>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Personal Statement / Why This University?
                        </label>
                        <textarea
                          value={applicationData.personal_statement || ''}
                          onChange={(e) => setApplicationData(prev => ({...prev, personal_statement: e.target.value}))}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none"
                          placeholder="Write about why you want to attend this university, your academic interests, and how you would contribute to the campus community..."
                        />
                        <p className="text-sm text-gray-500 mt-1">This will help you prepare for your actual application essays.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes & Goals
                        </label>
                        <textarea
                          value={applicationData.notes || ''}
                          onChange={(e) => setApplicationData(prev => ({...prev, notes: e.target.value}))}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none"
                          placeholder="Any additional notes, application strategy, or goals for this university..."
                        />
                      </div>

                      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCurrentStep('browse')}
                          className="px-6 py-2"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 px-6 py-2"
                        >
                          Add to My Applications
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
