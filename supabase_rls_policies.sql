-- RLS Policies for HMS (Hospital Management System)
-- Run this after creating the schema (supabase_schema.sql)
-- These policies ensure users can only access data appropriate to their role

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.schedules enable row level security;
alter table public.notices enable row level security;
alter table public.attendance enable row level security;

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Allow insert on profiles (for registration)
create policy "Allow profile creation on signup"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================================================
-- PATIENTS TABLE POLICIES
-- ============================================================================

-- Staff can view their assigned patients
create policy "Staff can view assigned patients"
  on public.patients for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() 
      and (role = 'staff' and assigned_staff_id = auth.uid())
    )
  );

-- Doctors can view their assigned patients
create policy "Doctors can view assigned patients"
  on public.patients for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() 
      and (role = 'doctor' and primary_doctor_id = auth.uid())
    )
  );

-- Admins can view all patients
create policy "Admins can view all patients"
  on public.patients for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can insert/update/delete patients
create policy "Admins can manage patients"
  on public.patients for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- APPOINTMENTS TABLE POLICIES
-- ============================================================================

-- Patients can view their own appointments
create policy "Patients can view own appointments"
  on public.appointments for select
  using (patient_id = auth.uid());

-- Patients can insert their own appointments (request)
create policy "Patients can request appointments"
  on public.appointments for insert
  with check (patient_id = auth.uid());

-- Staff can view appointments they're assigned to
create policy "Staff can view assigned appointments"
  on public.appointments for select
  using (staff_id = auth.uid());

-- Doctors can view their appointments
create policy "Doctors can view their appointments"
  on public.appointments for select
  using (doctor_id = auth.uid());

-- Doctors can update their appointments (accept/reject)
create policy "Doctors can update their appointments"
  on public.appointments for update
  using (doctor_id = auth.uid());

-- Admins can view all appointments
create policy "Admins can view all appointments"
  on public.appointments for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can manage all appointments
create policy "Admins can manage appointments"
  on public.appointments for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- SCHEDULES TABLE POLICIES
-- ============================================================================

-- Doctors can view and manage their own schedules
create policy "Doctors can view own schedules"
  on public.schedules for select
  using (doctor_id = auth.uid());

create policy "Doctors can insert own schedules"
  on public.schedules for insert
  with check (doctor_id = auth.uid());

create policy "Doctors can update own schedules"
  on public.schedules for update
  using (doctor_id = auth.uid());

create policy "Doctors can delete own schedules"
  on public.schedules for delete
  using (doctor_id = auth.uid());

-- Staff and patients can view schedules (to book appointments)
create policy "Users can view schedules"
  on public.schedules for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'patient', 'admin')
    )
  );

-- Admins can manage all schedules
create policy "Admins can manage schedules"
  on public.schedules for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- NOTICES TABLE POLICIES
-- ============================================================================

-- Everyone can view notices
create policy "All users can view notices"
  on public.notices for select
  using (auth.uid() is not null);

-- Admins and doctors can create notices
create policy "Admins and doctors can create notices"
  on public.notices for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'doctor')
    )
  );

-- Admins can manage all notices
create policy "Admins can manage notices"
  on public.notices for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- ATTENDANCE TABLE POLICIES
-- ============================================================================

-- Staff can view and insert their own attendance
create policy "Staff can view own attendance"
  on public.attendance for select
  using (staff_id = auth.uid());

create policy "Staff can mark own attendance"
  on public.attendance for insert
  with check (staff_id = auth.uid());

-- Admins can view all attendance
create policy "Admins can view all attendance"
  on public.attendance for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can manage all attendance
create policy "Admins can manage attendance"
  on public.attendance for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- End of RLS policies
