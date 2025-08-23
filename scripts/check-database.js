import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkDatabase() {
  console.log('Checking database connection...')
  
  try {
    // Check if we can connect to the database
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Database error:', error.message)
      
      if (error.message.includes('relation "public.profiles" does not exist')) {
        console.log('❌ profiles table does not exist')
        await createTables()
      } else {
        console.error('❌ Other database error:', error)
      }
    } else {
      console.log('✅ Database connection successful')
      console.log('✅ profiles table exists')
    }
  } catch (err) {
    console.error('❌ Failed to connect to database:', err)
  }
}

async function createTables() {
  console.log('Creating database tables...')
  
  try {
    // Read the SQL migration file and execute it
    const fs = require('fs')
    const path = require('path')
    
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20241201000000_initial_schema.sql')
    
    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
      
      console.log('Executing migration SQL...')
      
      // Split the SQL into individual statements and execute them
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement })
            if (error) {
              console.error('Error executing statement:', error.message)
              console.log('Statement:', statement.substring(0, 100) + '...')
            }
          } catch (err) {
            console.error('Failed to execute statement:', err)
          }
        }
      }
      
      console.log('✅ Migration completed')
    } else {
      console.error('❌ Migration file not found at:', migrationPath)
    }
    
  } catch (err) {
    console.error('❌ Failed to create tables:', err)
  }
}

// Run the check
checkDatabase().then(() => {
  console.log('Database check completed')
  process.exit(0)
}).catch((err) => {
  console.error('Database check failed:', err)
  process.exit(1)
})
