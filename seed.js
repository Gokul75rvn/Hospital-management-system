// seed.js - Populate demo data for HMS
// Run with: node seed.js
// NOTE: This uses the Supabase anon key. For production, use service_role key for admin operations.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mebxqdtfukdcmjcpvdvr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lYnhxZHRmdWtkY21qY3B2ZHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzA0ODgsImV4cCI6MjA3NjcwNjQ4OH0.kAm2DkO9Wmrs7H5r9eNWNmYqOy80Y5SyTVCDptegC3s'

// For seeding, you may want to use service_role key instead of anon key
// const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY_HERE'
// const supabase = createClient(supabaseUrl, supabaseServiceKey)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  console.log('🌱 Seeding HMS demo data...')

  // Note: This seed assumes you've already created users via Supabase Auth
  // For a real seed, you'd use the service_role key to bypass RLS and create auth users programmatically
  // Here we'll insert profiles, patients, appointments, schedules directly

  try {
    // Sample profile IDs (in production, these would match auth.users IDs created via signUp)
    const adminId = '00000000-0000-0000-0000-000000000001'
    const staffId = '00000000-0000-0000-0000-000000000002'
    const patientId = '00000000-0000-0000-0000-000000000003'
    const doctorId = '00000000-0000-0000-0000-000000000004'

    // Insert sample profiles (for demo - in real app, profiles are created on sign-up)
    console.log('Adding sample profiles...')
    const { error: profileError } = await supabase.from('profiles').upsert([
      { id: adminId, email: 'admin@hms.demo', role: 'admin', name: 'Admin User' },
      { id: staffId, email: 'staff@hms.demo', role: 'staff', name: 'Staff Member' },
      { id: patientId, email: 'patient@hms.demo', role: 'patient', name: 'John Patient' },
      { id: doctorId, email: 'doctor@hms.demo', role: 'doctor', name: 'Dr. Smith', specialization: 'Cardiology' },
    ], { onConflict: 'id' })
    if (profileError) console.error('Profile error:', profileError.message)
    else console.log('✅ Profiles added')

    // Insert sample patients
    console.log('Adding sample patients...')
    const { data: patients, error: patientError } = await supabase.from('patients').insert([
      { name: 'Alice Johnson', assigned_staff_id: staffId, primary_doctor_id: doctorId },
      { name: 'Bob Williams', assigned_staff_id: staffId, primary_doctor_id: doctorId },
      { name: 'Charlie Brown', assigned_staff_id: staffId, primary_doctor_id: doctorId },
    ]).select()
    if (patientError) console.error('Patient error:', patientError.message)
    else console.log('✅ Patients added:', patients?.length)

    // Insert sample appointments
    console.log('Adding sample appointments...')
    const today = new Date().toISOString().slice(0, 10)
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    const { error: apptError } = await supabase.from('appointments').insert([
      { patient_id: patients?.[0]?.id || patientId, staff_id: staffId, doctor_id: doctorId, date: today, time: '10:00 AM', status: 'pending' },
      { patient_id: patients?.[1]?.id || patientId, staff_id: staffId, doctor_id: doctorId, date: today, time: '11:00 AM', status: 'accepted' },
      { patient_id: patients?.[2]?.id || patientId, staff_id: staffId, doctor_id: doctorId, date: tomorrow, time: '09:00 AM', status: 'pending' },
    ])
    if (apptError) console.error('Appointment error:', apptError.message)
    else console.log('✅ Appointments added')

    // Insert sample doctor schedules
    console.log('Adding sample schedules...')
    const { error: schedError } = await supabase.from('schedules').insert([
      { doctor_id: doctorId, date: today, start_time: '09:00', end_time: '10:00', slot_status: 'available' },
      { doctor_id: doctorId, date: today, start_time: '10:00', end_time: '11:00', slot_status: 'booked' },
      { doctor_id: doctorId, date: today, start_time: '11:00', end_time: '12:00', slot_status: 'available' },
      { doctor_id: doctorId, date: tomorrow, start_time: '09:00', end_time: '10:00', slot_status: 'available' },
    ])
    if (schedError) console.error('Schedule error:', schedError.message)
    else console.log('✅ Schedules added')

    // Insert sample notices
    console.log('Adding sample notices...')
    const { error: noticeError } = await supabase.from('notices').insert([
      { title: 'Welcome to HMS', message: 'This is a demo notice for all staff.' },
      { title: 'System Maintenance', message: 'Scheduled maintenance on Friday.' },
    ])
    if (noticeError) console.error('Notice error:', noticeError.message)
    else console.log('✅ Notices added')

    console.log('🎉 Seeding complete!')
  } catch (err) {
    console.error('Seed error:', err)
  }
}

seed()
