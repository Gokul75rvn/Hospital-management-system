import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || 'https://mebxqdtfukdcmjcpvdvr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lYnhxZHRmdWtkY21qY3B2ZHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzA0ODgsImV4cCI6MjA3NjcwNjQ4OH0.kAm2DkO9Wmrs7H5r9eNWNmYqOy80Y5SyTVCDptegC3s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
