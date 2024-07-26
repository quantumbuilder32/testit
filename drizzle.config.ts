import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL as string
    }
})


// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://soladsdaxltubfwjgdyr.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)