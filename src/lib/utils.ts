import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function getDaysUntilDeadline(deadline: string | Date) {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function getDeadlineStatus(deadline: string | Date) {
  const days = getDaysUntilDeadline(deadline)
  
  if (days < 0) return { status: 'overdue', color: 'text-red-600' }
  if (days <= 7) return { status: 'urgent', color: 'text-orange-600' }
  if (days <= 30) return { status: 'upcoming', color: 'text-yellow-600' }
  return { status: 'future', color: 'text-gray-600' }
}

export function getStatusColor(status: string) {
  const colors = {
    not_started: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    submitted: 'bg-green-100 text-green-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    decision_received: 'bg-purple-100 text-purple-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    waitlisted: 'bg-orange-100 text-orange-800',
    deferred: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export function formatApplicationType(type: string) {
  const types = {
    early_decision: 'Early Decision',
    early_action: 'Early Action',
    regular_decision: 'Regular Decision',
    rolling_admission: 'Rolling Admission',
  }
  return types[type as keyof typeof types] || type
}

export function formatRequirementType(type: string) {
  const types = {
    essay: 'Essay',
    recommendation_letter: 'Recommendation Letter',
    transcript: 'Transcript',
    test_scores: 'Test Scores',
    portfolio: 'Portfolio',
    interview: 'Interview',
    financial_aid: 'Financial Aid',
  }
  return types[type as keyof typeof types] || type
}
