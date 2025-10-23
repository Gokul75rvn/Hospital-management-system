-- Hospital Management System - Complete Database Schema
-- Run this in your Supabase SQL Editor

-- Enable required extensions
create extension if not exists pgcrypto;

-- =============================================
-- PROFILES TABLE
-- =============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  role text not null check (role in ('admin','doctor','staff','patient')),
  specialization text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- =============================================
-- PATIENTS TABLE
-- =============================================
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer,
  condition text,
  assigned_staff_id uuid references public.profiles(id),
  primary_doctor_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc', now())
);

-- =============================================
-- APPOINTMENTS TABLE
-- =============================================
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id),
  doctor_id uuid not null references public.profiles(id),
  date date not null,
  time text not null,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','completed','cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- =============================================
-- SCHEDULES TABLE
-- =============================================
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.profiles(id),
  date date not null,
  start_time text not null,
  end_time text not null,
  slot_status text not null default 'available' check (slot_status in ('available','booked','unavailable')),
  created_at timestamp with time zone default timezone('utc', now())
);

-- =============================================
-- NOTICES TABLE
-- =============================================
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc', now())
);

-- =============================================
-- ATTENDANCE TABLE
-- =============================================
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.profiles(id),
  date date not null,
  status text not null check (status in ('present','absent','leave')),
  created_at timestamp with time zone default timezone('utc', now()),
  unique(staff_id, date)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_appointments_patient on public.appointments(patient_id);
create index if not exists idx_appointments_doctor on public.appointments(doctor_id);
create index if not exists idx_appointments_date on public.appointments(date);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_schedules_doctor_date on public.schedules(doctor_id, date);
create index if not exists idx_attendance_staff_date on public.attendance(staff_id, date);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.schedules enable row level security;
alter table public.notices enable row level security;
alter table public.attendance enable row level security;

-- Profiles: Users can read all profiles, update their own
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Appointments: Users can view their own appointments
create policy "Users can view relevant appointments"
  on public.appointments for select
  using (
    auth.uid() = patient_id 
    or auth.uid() = doctor_id
    or exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

create policy "Patients can create appointments"
  on public.appointments for insert
  with check (auth.uid() = patient_id);

create policy "Doctors and admins can update appointments"
  on public.appointments for update
  using (
    auth.uid() = doctor_id
    or exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Schedules: Everyone can view, doctors can manage their own
create policy "Schedules are viewable by everyone"
  on public.schedules for select
  using (true);

create policy "Doctors can manage their schedules"
  on public.schedules for all
  using (auth.uid() = doctor_id);

-- Notices: Everyone can view, admins can create
create policy "Notices are viewable by everyone"
  on public.notices for select
  using (true);

create policy "Admins can create notices"
  on public.notices for insert
  with check (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Attendance: Staff can view and mark their own
create policy "Staff can view their attendance"
  on public.attendance for select
  using (auth.uid() = staff_id or exists (
    select 1 from public.profiles 
    where id = auth.uid() and role in ('admin', 'doctor')
  ));

create policy "Staff can mark their attendance"
  on public.attendance for insert
  with check (auth.uid() = staff_id);

-- Patients: Viewable by staff, doctors, and admins
create policy "Authorized users can view patients"
  on public.patients for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'doctor', 'staff')
    )
  );

create policy "Admins and staff can manage patients"
  on public.patients for all
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- =============================================
-- REALTIME PUBLICATIONS
-- =============================================
alter publication supabase_realtime add table public.appointments;
alter publication supabase_realtime add table public.notices;
alter publication supabase_realtime add table public.schedules;
