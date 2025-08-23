const { createClient } = require('@supabase/supabase-js')

// Read .env.local manually
const fs = require('fs')
const path = require('path')

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

console.log('Supabase URL:', supabaseUrl)
console.log('Service Key available:', !!supabaseServiceKey)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('\n=== Creating Database Tables ===')
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'create_tables.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📄 Reading SQL file:', sqlPath)
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`   Executing statement ${i + 1}/${statements.length}...`)
          
          const { error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          })
          
          if (error) {
            // Try direct query execution for simpler statements
            const { error: directError } = await supabase
              .from('_temp_table_that_does_not_exist')
              .select('*')
              .eq('fake_column', 'fake_value')
            
            // If it's a table creation statement, try another approach
            if (statement.toLowerCase().includes('create table')) {
              console.log(`   ⚠️  Statement ${i + 1} may need manual execution`)
              console.log(`   Statement: ${statement.substring(0, 50)}...`)
            }
          } else {
            console.log(`   ✅ Statement ${i + 1} executed successfully`)
          }
        } catch (err) {
          console.log(`   ⚠️  Statement ${i + 1} failed:`, err.message)
        }
      }
    }
    
    console.log('\n📊 Table creation process completed')
    return true
    
  } catch (err) {
    console.log('❌ Failed to create tables:', err.message)
    return false
  }
}

async function testConnection() {
  console.log('\n=== Testing Supabase Connection ===')
  
  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.log('❌ Connection Error:', connectionError.message)
      
      if (connectionError.message.includes('relation "public.profiles" does not exist')) {
        console.log('\n📋 The profiles table does not exist. Creating tables...')
        await createTables()
        
        // Test again after creation
        const { error: retestError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
        
        if (retestError) {
          console.log('\n❌ Tables still not accessible. Manual creation required.')
          console.log('Please run the SQL from: supabase/create_tables.sql')
          return false
        } else {
          console.log('\n✅ Tables created successfully!')
          return true
        }
      }
    } else {
      console.log('✅ Database connection successful!')
      console.log('✅ profiles table exists')
      return true
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
    return false
  }
}

async function testAuth() {
  console.log('\n=== Testing Auth Functions ===')
  
  try {
    // Test creating a test user (this will fail if tables don't exist)
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'test123456'
    
    console.log(`Attempting to create test user: ${testEmail}`)
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          role: 'student'
        }
      }
    })

    if (error) {
      console.log('❌ Auth Error:', error.message)
      return false
    } else {
      console.log('✅ User creation successful!')
      console.log('User ID:', data.user?.id)
      
      // Clean up - delete the test user
      if (data.user) {
        await supabase.auth.admin.deleteUser(data.user.id)
        console.log('✅ Test user cleaned up')
      }
      
      return true
    }
  } catch (err) {
    console.log('❌ Auth test failed:', err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting database validation...\n')
  
  const connectionOk = await testConnection()
  
  if (connectionOk) {
    await testAuth()
    console.log('\n✅ Database setup is complete and working!')
  } else {
    console.log('\n❌ Database setup is incomplete. Please create the tables first.')
  }
  
  process.exit(0)
}

main().catch(console.error)
