const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local manually
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value && !key.startsWith('#')) {
        process.env[key.trim()] = value.trim()
      }
    })
  } catch (err) {
    console.error('Failed to load .env.local:', err.message)
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTablesDirectly() {
  console.log('🚀 Creating database tables directly...\n')
  
  try {
    // Create profiles table
    console.log('📋 Creating profiles table...')
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'student',
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (profilesError) {
      console.log('❌ Profiles table creation failed:', profilesError.message)
    } else {
      console.log('✅ Profiles table created')
    }

    // Create students table
    console.log('📋 Creating students table...')
    const { error: studentsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (studentsError) {
      console.log('❌ Students table creation failed:', studentsError.message)
    } else {
      console.log('✅ Students table created')
    }

    // Create parents table
    console.log('📋 Creating parents table...')
    const { error: parentsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.parents (
          id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
          phone VARCHAR(20),
          occupation VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (parentsError) {
      console.log('❌ Parents table creation failed:', parentsError.message)
    } else {
      console.log('✅ Parents table created')
    }

    // Create universities table
    console.log('📋 Creating universities table...')
    const { error: universitiesError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (universitiesError) {
      console.log('❌ Universities table creation failed:', universitiesError.message)
    } else {
      console.log('✅ Universities table created')
    }

    // Enable RLS and create policies
    console.log('📋 Setting up Row Level Security...')
    
    const rlsCommands = [
      'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.universities DISABLE ROW LEVEL SECURITY;'
    ]

    for (const command of rlsCommands) {
      const { error } = await supabase.rpc('exec_sql', { sql: command })
      if (error) {
        console.log('⚠️  RLS command failed:', error.message)
      }
    }

    // Create policies
    const policies = [
      'DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;',
      'CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);',
      'DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;',
      'CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);',
      'DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;',
      'CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);'
    ]

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy })
      if (error) {
        console.log('⚠️  Policy creation failed:', error.message)
      }
    }

    console.log('✅ Row Level Security configured')

  } catch (err) {
    console.error('❌ Table creation failed:', err.message)
    return false
  }

  return true
}

async function testTables() {
  console.log('\n🧪 Testing created tables...')
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.log('❌ Test failed:', error.message)
      return false
    } else {
      console.log('✅ Tables are accessible!')
      return true
    }
  } catch (err) {
    console.log('❌ Test error:', err.message)
    return false
  }
}

async function main() {
  console.log('🎯 Database Table Creation Script\n')
  console.log('Supabase URL:', supabaseUrl)
  console.log('Service Key available:', !!supabaseServiceKey)
  
  const created = await createTablesDirectly()
  
  if (created) {
    const working = await testTables()
    
    if (working) {
      console.log('\n🎉 Database setup completed successfully!')
      console.log('You can now test registration at: http://localhost:3001/auth/signup')
    } else {
      console.log('\n⚠️  Tables created but may need manual verification in Supabase dashboard')
    }
  } else {
    console.log('\n❌ Table creation failed. You may need to create tables manually.')
    console.log('Copy the SQL from: supabase/create_tables.sql')
    console.log('And run it in Supabase SQL Editor')
  }
  
  process.exit(0)
}

main().catch(console.error)
