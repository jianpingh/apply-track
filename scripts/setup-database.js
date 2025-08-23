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

async function createTablesWithAPI() {
  console.log('🎯 Creating tables using Supabase Management API...\n')
  
  try {
    // Since we can't execute arbitrary SQL, let's create a minimal profile manually
    // This will trigger Supabase to recognize the tables exist
    
    console.log('📋 Attempting to access profiles table...')
    
    // Try to create the tables using raw HTTP requests to Supabase REST API
    const headers = {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
    
    // Check if we can access the API
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: headers
    })
    
    console.log('API Status:', response.status)
    
    if (response.status === 200) {
      console.log('✅ API is accessible')
      
      // Try to check if profiles table exists by making a simple query
      const profilesResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=count&limit=1`, {
        headers: headers
      })
      
      console.log('Profiles table status:', profilesResponse.status)
      
      if (profilesResponse.status === 406 || profilesResponse.status === 404) {
        console.log('❌ Profiles table does not exist')
        console.log('\n📋 Manual table creation required.')
        console.log('Please follow these steps:')
        console.log('1. Go to https://supabase.com/dashboard')
        console.log('2. Select your project')
        console.log('3. Go to SQL Editor')
        console.log('4. Copy and paste the following SQL:')
        console.log('\n' + '='.repeat(60))
        
        const sqlPath = path.join(__dirname, '..', 'supabase', 'create_tables.sql')
        const sqlContent = fs.readFileSync(sqlPath, 'utf8')
        console.log(sqlContent)
        console.log('='.repeat(60))
        
        return false
      } else {
        console.log('✅ Tables appear to exist')
        return true
      }
    } else {
      console.log('❌ API not accessible')
      return false
    }
    
  } catch (err) {
    console.error('❌ API creation failed:', err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Database Setup Script\n')
  console.log('Supabase URL:', supabaseUrl)
  console.log('Service Key available:', !!supabaseServiceKey)
  
  const result = await createTablesWithAPI()
  
  if (!result) {
    console.log('\n❌ Automatic table creation not possible.')
    console.log('Manual creation required using Supabase Dashboard.')
    console.log('\nAfter creating tables manually, test with:')
    console.log('node scripts/test-database.js')
  }
  
  process.exit(0)
}

main().catch(console.error)
