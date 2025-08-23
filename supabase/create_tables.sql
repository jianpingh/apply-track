-- Basic table creation for Apply Track
-- Run this in Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    graduation_year INTEGER NOT NULL,
    gpa DECIMAL(3,2),
    sat_score INTEGER,
    act_score INTEGER,
    target_countries TEXT[] DEFAULT '{}',
    intended_majors TEXT[] DEFAULT '{}',
    high_school VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parents table
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    phone VARCHAR(20),
    occupation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create universities table (basic version)
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    state VARCHAR(100),
    city VARCHAR(100),
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

DROP POLICY IF EXISTS "Students can view own data" ON public.students;
DROP POLICY IF EXISTS "Students can update own data" ON public.students;
DROP POLICY IF EXISTS "Students can insert own data" ON public.students;
DROP POLICY IF EXISTS "Service role can insert students" ON public.students;

DROP POLICY IF EXISTS "Parents can view own data" ON public.parents;
DROP POLICY IF EXISTS "Parents can update own data" ON public.parents;
DROP POLICY IF EXISTS "Parents can insert own data" ON public.parents;
DROP POLICY IF EXISTS "Service role can insert parents" ON public.parents;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Service role can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- Create RLS policies for students
CREATE POLICY "Students can view own data" ON public.students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students can update own data" ON public.students FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Students can insert own data" ON public.students FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Service role can insert students" ON public.students FOR INSERT WITH CHECK (true);

-- Create RLS policies for parents
CREATE POLICY "Parents can view own data" ON public.parents FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Parents can update own data" ON public.parents FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Parents can insert own data" ON public.parents FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Service role can insert parents" ON public.parents FOR INSERT WITH CHECK (true);

-- Universities are public readable
ALTER TABLE public.universities DISABLE ROW LEVEL SECURITY;

-- Grant access
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.students TO authenticated;
GRANT ALL ON public.parents TO authenticated;
GRANT SELECT ON public.universities TO anon, authenticated;
