-- Disable email confirmation for development
-- Run this in Supabase SQL Editor

-- This will allow users to sign up without email confirmation
-- Note: This is for development only, in production you should enable email confirmation

-- Check current auth settings
SELECT * FROM auth.config;

-- Update auth settings to disable email confirmation requirement
-- Note: This might not work directly via SQL, you may need to use Supabase Dashboard

-- Alternative: Create a function to handle user signup with immediate confirmation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically confirm the user's email
  UPDATE auth.users 
  SET email_confirmed_at = NOW() 
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  
  -- Create profile record
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NOW(),
    NOW()
  );
  
  -- If it's a student, create student record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.students (id, graduation_year, target_countries, intended_majors, created_at, updated_at)
    VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data->>'graduation_year')::integer, 2025),
      '{}',
      '{}',
      NOW(),
      NOW()
    );
  END IF;
  
  -- If it's a parent, create parent record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'parent' THEN
    INSERT INTO public.parents (id, phone, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'phone',
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
