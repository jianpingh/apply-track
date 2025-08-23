-- Fix RLS policies for Apply Track
-- Run this SQL in Supabase SQL Editor to fix the RLS policy issues

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow signup profile creation" ON public.profiles;

DROP POLICY IF EXISTS "Students can view own data" ON public.students;
DROP POLICY IF EXISTS "Students can update own data" ON public.students;
DROP POLICY IF EXISTS "Students can insert own data" ON public.students;
DROP POLICY IF EXISTS "Service role can insert students" ON public.students;

DROP POLICY IF EXISTS "Parents can view own data" ON public.parents;
DROP POLICY IF EXISTS "Parents can update own data" ON public.parents;
DROP POLICY IF EXISTS "Parents can insert own data" ON public.parents;
DROP POLICY IF EXISTS "Service role can insert parents" ON public.parents;

-- Create permissive policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Allow signup profile creation" ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

-- Create permissive policies for students table
CREATE POLICY "Students can view own data" ON public.students 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own data" ON public.students 
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can insert own data" ON public.students 
FOR INSERT WITH CHECK (auth.uid() = id);

-- Create permissive policies for parents table
CREATE POLICY "Parents can view own data" ON public.parents 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Parents can update own data" ON public.parents 
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Parents can insert own data" ON public.parents 
FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.students TO authenticated;
GRANT ALL ON public.parents TO authenticated;
GRANT SELECT ON public.universities TO authenticated;
