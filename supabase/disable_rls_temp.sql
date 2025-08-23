-- Temporary disable RLS for testing signup
-- Run this in Supabase SQL Editor to allow profile creation during signup

-- Temporarily disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities DISABLE ROW LEVEL SECURITY;

-- Grant full access to authenticated users
GRANT ALL ON public.profiles TO authenticated, anon;
GRANT ALL ON public.students TO authenticated, anon;
GRANT ALL ON public.parents TO authenticated, anon;
GRANT ALL ON public.universities TO authenticated, anon;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- If you want to re-enable RLS later, uncomment these lines:
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

-- And create proper policies:
-- CREATE POLICY "Allow all for authenticated users" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON public.students FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON public.parents FOR ALL TO authenticated USING (true) WITH CHECK (true);
