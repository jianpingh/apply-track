'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null)
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

  const handleSelectUniversity = (university: any) => {
    setSelectedUniversity(university)
    setCurrentStep('apply')
  }

  const handleAddApplication = (e: React.FormEvent) => {
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
      <header className="sticky top-0 z-20 border-b border-gray-200 shadow-sm bg-white/80 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4" />
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
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {currentStep === 'browse' ? (
          <div>
            {/* Search and Filter Section */}
            <div className="mb-8">
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
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
                      className="w-full lg:w-auto"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                    {(searchTerm || Object.values(filters).some(f => f)) && (
                      <Button variant="outline" onClick={resetFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                  
                  {showFilters && (
                    <div className="pt-6 mt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">State</label>
                          <Select value={filters.state || "all"} onValueChange={(value) => {
                            setFilters(prev => ({...prev, state: value === "all" ? "" : value}))
                            setCurrentPage(1)
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="All States" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All States</SelectItem>
                              <SelectItem value="California">California</SelectItem>
                              <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                              <SelectItem value="Connecticut">Connecticut</SelectItem>
                              <SelectItem value="New Jersey">New Jersey</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Ranking</label>
                          <Select value={filters.ranking || "all"} onValueChange={(value) => {
                            setFilters(prev => ({...prev, ranking: value === "all" ? "" : value}))
                            setCurrentPage(1)
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Rankings" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Rankings</SelectItem>
                              <SelectItem value="top10">Top 10</SelectItem>
                              <SelectItem value="top25">Top 25</SelectItem>
                              <SelectItem value="top50">Top 50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Selectivity</label>
                          <Select value={filters.acceptanceRate || "all"} onValueChange={(value) => {
                            setFilters(prev => ({...prev, acceptanceRate: value === "all" ? "" : value}))
                            setCurrentPage(1)
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="low">Highly Selective (&lt;10%)</SelectItem>
                              <SelectItem value="medium">Selective (10-25%)</SelectItem>
                              <SelectItem value="high">Less Selective (&gt;25%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Major Interest</label>
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
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUniversities.length)} of {filteredUniversities.length} universities
              </p>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Universities Grid */}
            <div className="mb-8 space-y-6">
              {paginatedUniversities.map((university) => (
                <Card key={university.id} className="overflow-hidden transition-all duration-300 bg-white border-0 shadow-lg hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{university.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className="font-semibold text-blue-800 bg-blue-100">
                              #{university.us_news_ranking} US News
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span>{university.city}, {university.state}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="w-4 h-4 text-green-500" />
                            <span>Founded {university.founded}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span>{university.student_body.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Globe className="w-4 h-4 text-orange-500" />
                            <span>{university.campus_size}</span>
                          </div>
                        </div>
                        
                        <p className="mb-4 leading-relaxed text-gray-700">{university.description}</p>
                      </div>
                    </div>

                    {/* Popular Academic Programs and Action Button Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-6">
                        <h4 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                          <BookOpen className="w-4 h-4 mr-1 text-slate-500" />
                          Popular Academic Programs
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {university.popular_majors.slice(0, 4).map((major) => (
                            <Badge key={major} className="text-xs transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200">
                              {major}
                            </Badge>
                          ))}
                          {university.popular_majors.length > 4 && (
                            <Badge className="text-xs text-gray-500 bg-gray-50">
                              +{university.popular_majors.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Button 
                          onClick={() => handleSelectUniversity(university)}
                          className="px-6 py-2 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
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
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-24 h-10"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
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
                  className="flex items-center justify-center w-20 h-10"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Application Configuration Step
          <div className="mx-auto max-w-7xl">
            {selectedUniversity && (
              <div className="space-y-6">
                {/* University Header */}
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="mb-2 text-4xl font-bold text-gray-800">{selectedUniversity.name}</CardTitle>
                        <CardDescription className="mb-4 text-xl text-gray-600">
                          {selectedUniversity.city}, {selectedUniversity.state} • Founded {selectedUniversity.founded}
                        </CardDescription>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-gray-600 md:grid-cols-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{selectedUniversity.city}, {selectedUniversity.state}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>Founded {selectedUniversity.founded}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{selectedUniversity.student_body.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4" />
                            <span>{selectedUniversity.campus_size}</span>
                          </div>
                        </div>
                        <p className="max-w-4xl text-lg leading-relaxed text-gray-700">{selectedUniversity.description}</p>
                      </div>
                      <Badge className="px-4 py-2 text-lg font-semibold text-gray-700 bg-gray-100 border border-gray-300">
                        #{selectedUniversity.us_news_ranking} US News
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  {/* Statistics Grid */}
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                      <div className="p-6 text-center border border-gray-200 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl">
                        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 text-white bg-gray-600 rounded-full">
                          <Users className="w-6 h-6" />
                        </div>
                        <p className="mb-1 text-sm font-medium text-gray-600">Acceptance Rate</p>
                        <p className="text-3xl font-bold text-gray-800">{selectedUniversity.acceptance_rate}%</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedUniversity.acceptance_rate < 10 ? 'Highly Selective' : 
                           selectedUniversity.acceptance_rate < 25 ? 'Selective' : 'Moderately Selective'}
                        </p>
                      </div>
                      <div className="p-6 text-center border bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border-emerald-200">
                        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 text-white rounded-full bg-emerald-600">
                          <DollarSign className="w-6 h-6" />
                        </div>
                        <p className="mb-1 text-sm font-medium text-emerald-700">Annual Tuition</p>
                        <p className="text-3xl font-bold text-emerald-800">${selectedUniversity.tuition_out_state.toLocaleString()}</p>
                        <p className="mt-1 text-sm text-emerald-600">Out-of-State</p>
                      </div>
                      <div className="p-6 text-center border border-gray-200 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl">
                        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 text-white bg-gray-600 rounded-full">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <p className="mb-1 text-sm font-medium text-gray-600">Application Fee</p>
                        <p className="text-3xl font-bold text-gray-800">${selectedUniversity.application_fee}</p>
                        <p className="mt-1 text-sm text-gray-500">{selectedUniversity.application_system}</p>
                      </div>
                    </div>

                    {/* Detailed Information Sections */}
                    <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
                      {/* Notable Alumni */}
                      <Card className="border-l-4 shadow-sm border-l-amber-300">
                        <CardContent className="p-6">
                          <h4 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
                            <Star className="w-6 h-6 mr-3 text-amber-500" />
                            Notable Alumni
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedUniversity.notable_alumni.map((alumni: string) => (
                              <Badge key={alumni} className="px-4 py-2 text-sm bg-amber-50 border-amber-200 text-amber-800">
                                {alumni}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Popular Majors */}
                      <Card className="border-l-4 shadow-sm border-l-slate-300">
                        <CardContent className="p-6">
                          <h4 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
                            <BookOpen className="w-6 h-6 mr-3 text-slate-500" />
                            Popular Academic Programs
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedUniversity.popular_majors.map((major: string) => (
                              <Badge key={major} className="px-4 py-2 text-sm transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200">
                                {major}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Key Highlights */}
                      <Card className="border-l-4 shadow-sm border-l-emerald-300">
                        <CardContent className="p-6">
                          <h4 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
                            <Award className="w-6 h-6 mr-3 text-emerald-500" />
                            Key Strengths & Highlights
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedUniversity.highlights.map((highlight: string) => (
                              <Badge key={highlight} className="px-4 py-2 text-sm border bg-emerald-50 text-emerald-800 border-emerald-200">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Application Deadlines */}
                      <Card className="border-l-4 shadow-sm border-l-rose-300">
                        <CardContent className="p-6">
                          <h4 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
                            <Calendar className="w-6 h-6 mr-3 text-rose-500" />
                            Application Deadlines
                          </h4>
                          <div className="space-y-3">
                            {selectedUniversity.deadlines.early_action && (
                              <div className="p-4 border rounded-lg bg-rose-50 border-rose-200">
                                <p className="text-lg font-semibold text-rose-800">Early Action</p>
                                <p className="text-rose-600">{selectedUniversity.deadlines.early_action}</p>
                              </div>
                            )}
                            <div className="p-4 border rounded-lg bg-slate-50 border-slate-200">
                              <p className="text-lg font-semibold text-slate-800">Regular Decision</p>
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
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Application Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure your application settings for {selectedUniversity.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Application Type</label>
                        <Select 
                          value={applicationData.application_type} 
                          onValueChange={(value) => setApplicationData(prev => ({...prev, application_type: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select application type" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedUniversity.deadlines.early_action && (
                              <SelectItem value="early_action">
                                Early Action - Deadline: {selectedUniversity.deadlines.early_action}
                              </SelectItem>
                            )}
                            <SelectItem value="regular_decision">
                              Regular Decision - Deadline: {selectedUniversity.deadlines.regular_decision}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Priority Level</label>
                        <Select 
                          value={applicationData.priority?.toString()} 
                          onValueChange={(value) => setApplicationData(prev => ({...prev, priority: parseInt(value)}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">High Priority (Dream School)</SelectItem>
                            <SelectItem value="2">Medium Priority (Target School)</SelectItem>
                            <SelectItem value="3">Low Priority (Safety School)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements Checklist */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Application Requirements
                    </CardTitle>
                    <CardDescription>
                      Complete these requirements to submit your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {selectedUniversity.requirements.map((req: string, index: number) => (
                        <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50">
                          <CheckCircle className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" />
                          <span className="text-sm text-gray-700">{req}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 mt-6 border rounded-lg bg-slate-50 border-slate-200">
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-slate-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="mb-1 font-semibold text-slate-800">Application System</h4>
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
                      <FileText className="w-6 h-6 mr-3 text-slate-600" />
                      Configure Your Application
                    </CardTitle>
                    <CardDescription className="text-base">
                      Set up your application preferences and add personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddApplication} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Preferred Major
                          </label>
                          <Select 
                            value={applicationData.major || ''} 
                            onValueChange={(value) => setApplicationData(prev => ({...prev, major: value}))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select your preferred major" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedUniversity.popular_majors.map((major: string) => (
                                <SelectItem key={major} value={major}>{major}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Application Type
                          </label>
                          <Select 
                            value={applicationData.application_type} 
                            onValueChange={(value) => setApplicationData(prev => ({...prev, application_type: value}))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select application type" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedUniversity.deadlines.early_action && (
                                <SelectItem value="early_action">Early Action - {selectedUniversity.deadlines.early_action}</SelectItem>
                              )}
                              <SelectItem value="regular_decision">Regular Decision - {selectedUniversity.deadlines.regular_decision}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Priority Level
                          </label>
                          <Select 
                            value={applicationData.priority?.toString()} 
                            onValueChange={(value) => setApplicationData(prev => ({...prev, priority: parseInt(value)}))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select priority level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">🎯 High Priority (Dream School)</SelectItem>
                              <SelectItem value="2">📚 Medium Priority (Target School)</SelectItem>
                              <SelectItem value="3">✅ Low Priority (Safety School)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Expected Graduation Year
                          </label>
                          <Select 
                            value={applicationData.graduation_year || ''} 
                            onValueChange={(value) => setApplicationData(prev => ({...prev, graduation_year: value}))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select graduation year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2028">2028</SelectItem>
                              <SelectItem value="2029">2029</SelectItem>
                              <SelectItem value="2030">2030</SelectItem>
                              <SelectItem value="2031">2031</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Personal Statement / Why This University?
                        </label>
                        <textarea
                          value={applicationData.personal_statement || ''}
                          onChange={(e) => setApplicationData(prev => ({...prev, personal_statement: e.target.value}))}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          placeholder="Write about why you want to attend this university, your academic interests, and how you would contribute to the campus community..."
                        />
                        <p className="mt-1 text-sm text-gray-500">This will help you prepare for your actual application essays.</p>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Additional Notes & Goals
                        </label>
                        <textarea
                          value={applicationData.notes || ''}
                          onChange={(e) => setApplicationData(prev => ({...prev, notes: e.target.value}))}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          placeholder="Any additional notes, application strategy, or goals for this university..."
                        />
                      </div>

                      <div className="flex justify-end pt-4 space-x-4 border-t border-gray-200">
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
                          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
