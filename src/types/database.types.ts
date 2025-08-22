export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'student' | 'parent' | 'teacher' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'student' | 'parent' | 'teacher' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'student' | 'parent' | 'teacher' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          graduation_year: number
          gpa: number | null
          sat_score: number | null
          act_score: number | null
          target_countries: string[]
          intended_majors: string[]
          high_school: string | null
          counselor_name: string | null
          counselor_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          graduation_year: number
          gpa?: number | null
          sat_score?: number | null
          act_score?: number | null
          target_countries?: string[]
          intended_majors?: string[]
          high_school?: string | null
          counselor_name?: string | null
          counselor_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          graduation_year?: number
          gpa?: number | null
          sat_score?: number | null
          act_score?: number | null
          target_countries?: string[]
          intended_majors?: string[]
          high_school?: string | null
          counselor_name?: string | null
          counselor_email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      parents: {
        Row: {
          id: string
          phone: string | null
          occupation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          occupation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          occupation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_parents: {
        Row: {
          id: string
          student_id: string
          parent_id: string
          relationship: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          parent_id: string
          relationship: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          parent_id?: string
          relationship?: string
          created_at?: string
        }
      }
      universities: {
        Row: {
          id: string
          name: string
          short_name: string | null
          country: string
          state: string | null
          city: string | null
          website_url: string | null
          logo_url: string | null
          us_news_ranking: number | null
          acceptance_rate: number | null
          application_system: string | null
          tuition_in_state: number | null
          tuition_out_state: number | null
          room_and_board: number | null
          application_fee: number | null
          deadlines: Json
          student_faculty_ratio: string | null
          total_enrollment: number | null
          popular_majors: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          country?: string
          state?: string | null
          city?: string | null
          website_url?: string | null
          logo_url?: string | null
          us_news_ranking?: number | null
          acceptance_rate?: number | null
          application_system?: string | null
          tuition_in_state?: number | null
          tuition_out_state?: number | null
          room_and_board?: number | null
          application_fee?: number | null
          deadlines?: Json
          student_faculty_ratio?: string | null
          total_enrollment?: number | null
          popular_majors?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          country?: string
          state?: string | null
          city?: string | null
          website_url?: string | null
          logo_url?: string | null
          us_news_ranking?: number | null
          acceptance_rate?: number | null
          application_system?: string | null
          tuition_in_state?: number | null
          tuition_out_state?: number | null
          room_and_board?: number | null
          application_fee?: number | null
          deadlines?: Json
          student_faculty_ratio?: string | null
          total_enrollment?: number | null
          popular_majors?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          student_id: string
          university_id: string
          application_type: 'early_decision' | 'early_action' | 'regular_decision' | 'rolling_admission'
          status: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'decision_received'
          priority: number | null
          deadline: string
          submitted_date: string | null
          decision_date: string | null
          decision_type: 'accepted' | 'rejected' | 'waitlisted' | 'deferred' | null
          financial_aid_requested: boolean | null
          financial_aid_amount: number | null
          scholarship_offered: number | null
          notes: string | null
          application_url: string | null
          portal_username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          university_id: string
          application_type: 'early_decision' | 'early_action' | 'regular_decision' | 'rolling_admission'
          status?: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'decision_received'
          priority?: number | null
          deadline: string
          submitted_date?: string | null
          decision_date?: string | null
          decision_type?: 'accepted' | 'rejected' | 'waitlisted' | 'deferred' | null
          financial_aid_requested?: boolean | null
          financial_aid_amount?: number | null
          scholarship_offered?: number | null
          notes?: string | null
          application_url?: string | null
          portal_username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          university_id?: string
          application_type?: 'early_decision' | 'early_action' | 'regular_decision' | 'rolling_admission'
          status?: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'decision_received'
          priority?: number | null
          deadline?: string
          submitted_date?: string | null
          decision_date?: string | null
          decision_type?: 'accepted' | 'rejected' | 'waitlisted' | 'deferred' | null
          financial_aid_requested?: boolean | null
          financial_aid_amount?: number | null
          scholarship_offered?: number | null
          notes?: string | null
          application_url?: string | null
          portal_username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      application_requirements: {
        Row: {
          id: string
          application_id: string
          requirement_type: 'essay' | 'recommendation_letter' | 'transcript' | 'test_scores' | 'portfolio' | 'interview' | 'financial_aid'
          requirement_name: string
          status: 'not_started' | 'in_progress' | 'completed' | 'submitted'
          deadline: string | null
          notes: string | null
          completed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          requirement_type: 'essay' | 'recommendation_letter' | 'transcript' | 'test_scores' | 'portfolio' | 'interview' | 'financial_aid'
          requirement_name: string
          status?: 'not_started' | 'in_progress' | 'completed' | 'submitted'
          deadline?: string | null
          notes?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          requirement_type?: 'essay' | 'recommendation_letter' | 'transcript' | 'test_scores' | 'portfolio' | 'interview' | 'financial_aid'
          requirement_name?: string
          status?: 'not_started' | 'in_progress' | 'completed' | 'submitted'
          deadline?: string | null
          notes?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      parent_notes: {
        Row: {
          id: string
          parent_id: string
          student_id: string
          application_id: string
          note_text: string
          is_private: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          student_id: string
          application_id: string
          note_text: string
          is_private?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          student_id?: string
          application_id?: string
          note_text?: string
          is_private?: boolean | null
          created_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          user_id: string
          student_id: string | null
          application_id: string | null
          action: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          student_id?: string | null
          application_id?: string | null
          action: string
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          student_id?: string | null
          application_id?: string | null
          action?: string
          details?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'parent' | 'teacher' | 'admin'
      application_type: 'early_decision' | 'early_action' | 'regular_decision' | 'rolling_admission'
      application_status: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'decision_received'
      decision_type: 'accepted' | 'rejected' | 'waitlisted' | 'deferred'
      requirement_type: 'essay' | 'recommendation_letter' | 'transcript' | 'test_scores' | 'portfolio' | 'interview' | 'financial_aid'
      requirement_status: 'not_started' | 'in_progress' | 'completed' | 'submitted'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
