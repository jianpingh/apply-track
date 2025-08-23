# Database Setup Instructions

## Problem
The error "Could not find the table 'public.profiles' in the schema cache" indicates that the database tables have not been created in your Supabase project.

## Solution
You need to manually create the database tables in Supabase. Follow these steps:

### Step 1: Access Supabase SQL Editor
1. Go to https://supabase.com
2. Sign in to your account
3. Select your project: `jgepefxchovheioqukba`
4. Click on "SQL Editor" in the left sidebar

### Step 2: Create the Tables
1. In the SQL Editor, create a new query
2. Copy and paste the entire content from the file: `supabase/create_tables.sql`
3. Click the "Run" button to execute the SQL

### Step 3: Verify Tables Creation
After running the SQL, you should see the following tables created:
- `public.profiles`
- `public.students` 
- `public.parents`
- `public.universities`

### Step 4: Test the Application
1. The development server should be running on http://localhost:3001
2. Go to http://localhost:3001/auth/signup
3. Try creating a new account
4. The data should now be stored successfully in the database

## Alternative: Use Supabase CLI (Advanced)
If you have Supabase CLI installed:
```bash
supabase db reset
supabase db push
```

## Verification Script
After creating the tables, you can run this command to verify:
```bash
node scripts/test-database.js
```

This should show "✅ Database connection successful!" instead of the error message.

## Next Steps
Once the tables are created:
1. Test user registration at http://localhost:3001/auth/signup
2. Test user login at http://localhost:3001/auth/login
3. Verify data is being stored in the Supabase dashboard under "Table Editor"
