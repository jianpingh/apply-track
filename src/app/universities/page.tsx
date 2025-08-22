'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  Users,
  Star,
  Plus,
  ExternalLink,
  Heart
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data - replace with real data from Supabase
const mockUniversities = [
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
    popular_majors: ['Economics', 'Computer Science', 'Government', 'Psychology'],
    total_enrollment: 23000,
    student_faculty_ratio: '7:1',
    deadlines: {
      early_action: '2024-11-01',
      regular_decision: '2025-01-01'
    }
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
    popular_majors: ['Computer Science', 'Engineering', 'Business', 'Biology'],
    total_enrollment: 17000,
    student_faculty_ratio: '5:1',
    deadlines: {
      early_action: '2024-11-01',
      regular_decision: '2025-01-02'
    }
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
    application_system: 'Direct Application',
    popular_majors: ['Engineering', 'Computer Science', 'Physics', 'Mathematics'],
    total_enrollment: 11000,
    student_faculty_ratio: '3:1',
    deadlines: {
      early_action: '2024-11-01',
      regular_decision: '2025-01-01'
    }
  },
  {
    id: '4',
    name: 'University of California, Berkeley',
    short_name: 'UC Berkeley',
    city: 'Berkeley',
    state: 'California',
    us_news_ranking: 22,
    acceptance_rate: 14.5,
    tuition_out_state: 46326,
    application_fee: 80,
    application_system: 'UC Application',
    popular_majors: ['Engineering', 'Business', 'Computer Science', 'Economics'],
    total_enrollment: 45000,
    student_faculty_ratio: '19:1',
    deadlines: {
      regular_decision: '2024-11-30'
    }
  }
]

export default function UniversitySearchPage() {
  const [universities, setUniversities] = useState(mockUniversities)
  const [filteredUniversities, setFilteredUniversities] = useState(mockUniversities)
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [filters, setFilters] = useState({
    state: '',
    rankingMax: 100,
    acceptanceRateMin: 0,
    tuitionMax: 100000,
    applicationSystem: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let filtered = universities.filter(uni => 
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.state.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filters.state) {
      filtered = filtered.filter(uni => uni.state === filters.state)
    }
    
    if (filters.rankingMax < 100) {
      filtered = filtered.filter(uni => uni.us_news_ranking <= filters.rankingMax)
    }
    
    if (filters.acceptanceRateMin > 0) {
      filtered = filtered.filter(uni => uni.acceptance_rate >= filters.acceptanceRateMin)
    }
    
    if (filters.tuitionMax < 100000) {
      filtered = filtered.filter(uni => uni.tuition_out_state <= filters.tuitionMax)
    }
    
    if (filters.applicationSystem) {
      filtered = filtered.filter(uni => uni.application_system === filters.applicationSystem)
    }

    setFilteredUniversities(filtered)
  }, [searchTerm, filters, universities])

  const toggleFavorite = (universityId: string) => {
    setFavorites(prev => 
      prev.includes(universityId) 
        ? prev.filter(id => id !== universityId)
        : [...prev, universityId]
    )
  }

  const addToApplications = (university: any) => {
    // TODO: Implement add to applications logic
    console.log('Adding to applications:', university.name)
  }

  const uniqueStates = [...new Set(universities.map(uni => uni.state))]
  const uniqueApplicationSystems = [...new Set(universities.map(uni => uni.application_system))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">University Search</h1>
              <p className="text-gray-600">Discover and explore universities that fit you</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{filteredUniversities.length} universities</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search university name, city, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card>
              <CardHeader>
                <CardTitle>Filter Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">State</label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={filters.state}
                      onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                    >
                      <option value="">All States</option>
                      {uniqueStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Max Ranking: {filters.rankingMax}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={filters.rankingMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, rankingMax: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Min Acceptance Rate: {filters.acceptanceRateMin}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.acceptanceRateMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, acceptanceRateMin: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Max Tuition: {formatCurrency(filters.tuitionMax)}
                    </label>
                    <input
                      type="range"
                      min="20000"
                      max="100000"
                      step="5000"
                      value={filters.tuitionMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, tuitionMax: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Application System</label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={filters.applicationSystem}
                      onChange={(e) => setFilters(prev => ({ ...prev, applicationSystem: e.target.value }))}
                    >
                      <option value="">All Systems</option>
                      {uniqueApplicationSystems.map(system => (
                        <option key={system} value={system}>{system}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      state: '',
                      rankingMax: 100,
                      acceptanceRateMin: 0,
                      tuitionMax: 100000,
                      applicationSystem: ''
                    })}
                  >
                    Reset
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* University Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((university) => (
            <Card key={university.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{university.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {university.city}, {university.state}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(university.id)}
                      className="p-1"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(university.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`} 
                      />
                    </Button>
                    <Badge variant="outline">#{university.us_news_ranking}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                    <span>Acceptance Rate: {university.acceptance_rate}%</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                    <span>{formatCurrency(university.tuition_out_state)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-purple-600" />
                    <span>Student-Faculty Ratio: {university.student_faculty_ratio}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-orange-600" />
                    <span>{university.application_system}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Popular Majors:</p>
                  <div className="flex flex-wrap gap-1">
                    {university.popular_majors.slice(0, 3).map((major) => (
                      <Badge key={major} variant="secondary" className="text-xs">
                        {major}
                      </Badge>
                    ))}
                    {university.popular_majors.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{university.popular_majors.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Application Deadlines:</p>
                  <div className="space-y-1 text-xs">
                    {university.deadlines.early_action && (
                      <div>Early Action: {university.deadlines.early_action}</div>
                    )}
                    {university.deadlines.regular_decision && (
                      <div>Regular Decision: {university.deadlines.regular_decision}</div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => addToApplications(university)}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Application
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching universities found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
