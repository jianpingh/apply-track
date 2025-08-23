-- Auto-confirm emails and create profiles for new users
-- Run this in Supabase SQL Editor

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user_signup() 
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the user's email immediately
  UPDATE auth.users 
  SET email_confirmed_at = NOW(),
      confirmed_at = NOW()
  WHERE id = NEW.id;
  
  -- Create profile record automatically
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Create role-specific records
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.students (id, graduation_year, target_countries, intended_majors, created_at, updated_at)
    VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data->>'graduation_year')::integer, 2025),
      '{}',
      '{}',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  ELSIF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'parent' THEN
    INSERT INTO public.parents (id, phone, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'phone',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for automatic user setup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();
