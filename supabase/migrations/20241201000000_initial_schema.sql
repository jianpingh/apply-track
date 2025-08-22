-- Apply Track Database Schema
-- This schema implements the requirements for a university application tracking system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'parent', 'teacher', 'admin');
CREATE TYPE application_type AS ENUM ('early_decision', 'early_action', 'regular_decision', 'rolling_admission');
CREATE TYPE application_status AS ENUM ('not_started', 'in_progress', 'submitted', 'under_review', 'decision_received');
CREATE TYPE decision_type AS ENUM ('accepted', 'rejected', 'waitlisted', 'deferred');
CREATE TYPE requirement_type AS ENUM ('essay', 'recommendation_letter', 'transcript', 'test_scores', 'portfolio', 'interview', 'financial_aid');
CREATE TYPE requirement_status AS ENUM ('not_started', 'in_progress', 'completed', 'submitted');

-- Users table (handles authentication via Supabase Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table with academic information
CREATE TABLE students (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    graduation_year INTEGER NOT NULL,
    gpa DECIMAL(3,2),
    sat_score INTEGER,
    act_score INTEGER,
    target_countries TEXT[] DEFAULT '{}',
    intended_majors TEXT[] DEFAULT '{}',
    high_school VARCHAR(255),
    counselor_name VARCHAR(255),
    counselor_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parents table
CREATE TABLE parents (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    phone VARCHAR(20),
    occupation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student-Parent relationships
CREATE TABLE student_parents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL, -- 'father', 'mother', 'guardian'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, parent_id)
);

-- Universities table with comprehensive information
CREATE TABLE universities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    state VARCHAR(100),
    city VARCHAR(100),
    website_url TEXT,
    logo_url TEXT,
    
    -- Rankings and stats
    us_news_ranking INTEGER,
    acceptance_rate DECIMAL(4,2),
    application_system VARCHAR(100), -- 'Common App', 'Coalition App', 'Direct Application'
    
    -- Financial information
    tuition_in_state DECIMAL(10,2),
    tuition_out_state DECIMAL(10,2),
    room_and_board DECIMAL(10,2),
    application_fee DECIMAL(6,2),
    
    -- Application deadlines (stored as JSON for flexibility)
    deadlines JSONB DEFAULT '{}', -- {early_decision: '2024-11-01', early_action: '2024-11-15', regular_decision: '2025-01-01'}
    
    -- Academic information
    student_faculty_ratio VARCHAR(10),
    total_enrollment INTEGER,
    popular_majors TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table - core tracking functionality
CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    
    -- Application details
    application_type application_type NOT NULL,
    status application_status NOT NULL DEFAULT 'not_started',
    priority INTEGER DEFAULT 5, -- 1-10 scale, 1 being highest priority
    
    -- Important dates
    deadline DATE NOT NULL,
    submitted_date DATE,
    decision_date DATE,
    decision_type decision_type,
    
    -- Financial aid
    financial_aid_requested BOOLEAN DEFAULT false,
    financial_aid_amount DECIMAL(10,2),
    scholarship_offered DECIMAL(10,2),
    
    -- Notes and tracking
    notes TEXT,
    application_url TEXT,
    portal_username VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one application per type per university per student
    UNIQUE(student_id, university_id, application_type)
);

-- Application requirements tracking
CREATE TABLE application_requirements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    requirement_type requirement_type NOT NULL,
    requirement_name VARCHAR(255) NOT NULL,
    status requirement_status NOT NULL DEFAULT 'not_started',
    deadline DATE,
    notes TEXT,
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent notes and communications
CREATE TABLE parent_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false, -- Whether visible to student
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log for tracking changes
CREATE TABLE activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'created_application', 'updated_status', 'added_note', etc.
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_deadline ON applications(deadline);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_universities_country_state ON universities(country, state);
CREATE INDEX idx_universities_ranking ON universities(us_news_ranking);
CREATE INDEX idx_application_requirements_application_id ON application_requirements(application_id);
CREATE INDEX idx_activity_log_student_id ON activity_log(student_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Students policies
CREATE POLICY "Students can view own data" ON students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students can update own data" ON students FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Parents can view their children's student data" ON students FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM student_parents sp
        WHERE sp.student_id = students.id AND sp.parent_id = auth.uid()
    )
);

-- Applications policies
CREATE POLICY "Students can manage own applications" ON applications FOR ALL USING (
    student_id = auth.uid()
);
CREATE POLICY "Parents can view children's applications" ON applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM student_parents sp
        WHERE sp.student_id = applications.student_id AND sp.parent_id = auth.uid()
    )
);

-- Application requirements policies
CREATE POLICY "Students can manage own application requirements" ON application_requirements FOR ALL USING (
    EXISTS (
        SELECT 1 FROM applications a
        WHERE a.id = application_requirements.application_id AND a.student_id = auth.uid()
    )
);

-- Parent notes policies
CREATE POLICY "Parents can manage own notes" ON parent_notes FOR ALL USING (parent_id = auth.uid());
CREATE POLICY "Students can view non-private parent notes" ON parent_notes FOR SELECT USING (
    student_id = auth.uid() AND NOT is_private
);

-- Functions for automated tasks
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_application_requirements_updated_at BEFORE UPDATE ON application_requirements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
