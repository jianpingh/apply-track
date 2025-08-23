-- Apply Track Database Schema - Basic Tables
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'parent', 'teacher', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_type AS ENUM ('early_decision', 'early_action', 'regular_decision', 'rolling_admission');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('not_started', 'in_progress', 'submitted', 'under_review', 'decision_received');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table (handles authentication via Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table with academic information
CREATE TABLE IF NOT EXISTS students (
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
CREATE TABLE IF NOT EXISTS parents (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    phone VARCHAR(20),
    occupation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Universities table with comprehensive information
CREATE TABLE IF NOT EXISTS universities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    state VARCHAR(100),
    city VARCHAR(100),
    website_url TEXT,
    logo_url TEXT,
    us_news_ranking INTEGER,
    acceptance_rate DECIMAL(4,2),
    application_system VARCHAR(100),
    tuition_in_state DECIMAL(10,2),
    tuition_out_state DECIMAL(10,2),
    room_and_board DECIMAL(10,2),
    application_fee DECIMAL(6,2),
    deadlines JSONB DEFAULT '{}',
    student_faculty_ratio VARCHAR(10),
    total_enrollment INTEGER,
    popular_majors TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table - core tracking functionality
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    application_type application_type NOT NULL,
    status application_status NOT NULL DEFAULT 'not_started',
    priority INTEGER DEFAULT 5,
    deadline DATE NOT NULL,
    submitted_date DATE,
    decision_date DATE,
    financial_aid_requested BOOLEAN DEFAULT false,
    financial_aid_amount DECIMAL(10,2),
    scholarship_offered DECIMAL(10,2),
    notes TEXT,
    application_url TEXT,
    portal_username VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, university_id, application_type)
);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Students can view own data" ON students;
CREATE POLICY "Students can view own data" ON students FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Students can update own data" ON students;
CREATE POLICY "Students can update own data" ON students FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Students can insert own data" ON students;
CREATE POLICY "Students can insert own data" ON students FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Parents can view own data" ON parents;
CREATE POLICY "Parents can view own data" ON parents FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Parents can update own data" ON parents;
CREATE POLICY "Parents can update own data" ON parents FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Parents can insert own data" ON parents;
CREATE POLICY "Parents can insert own data" ON parents FOR INSERT WITH CHECK (auth.uid() = id);

-- Universities table is public for reading
ALTER TABLE universities DISABLE ROW LEVEL SECURITY;

-- Enable public read access to universities
GRANT SELECT ON universities TO anon, authenticated;
