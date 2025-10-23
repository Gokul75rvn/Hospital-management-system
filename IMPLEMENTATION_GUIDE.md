# 🏥 Hospital Management System

A complete, professional Hospital Management System built with React (Vite), Tailwind CSS, and Supabase for authentication, database, and real-time features.

## 🎯 Features

### 🔐 Authentication & Authorization
- Role-based authentication (Admin, Doctor, Staff, Patient)
- Secure login and registration with Supabase Auth
- Protected routes with automatic role-based redirection
- Profile management

### 👨‍💼 Admin Dashboard
- System statistics (Total Patients, Doctors, Staff, Appointments)
- Real-time updates when new users register or appointments are created
- Send system-wide notices to all users
- Live notification system

### 🩺 Doctor Dashboard
- View pending and accepted appointments
- Accept/Reject appointment requests
- Real-time notifications for new appointment requests
- View list of assigned patients
- Manage schedule availability

### 🧾 Staff Dashboard
- Mark daily attendance
- View today's appointments
- Manage assigned patients
- "Assist Doctor" feature to view doctor's appointments
- Real-time appointment updates

### 👨‍⚕️ Patient Dashboard
- Book appointments with doctors
- View upcoming and past appointments
- Real-time status updates when appointments are accepted/rejected
- Profile card with personal information
- List of available doctors with specializations

### 🎨 UI/UX Features
- Modern, responsive design with Tailwind CSS
- Role-specific color themes:
  - Admin: Blue & Gray
  - Doctor: Green & White
  - Staff: Orange highlights
  - Patient: Teal & White
- Dark mode support
- Smooth animations with Framer Motion
- Toast notifications for user feedback
- Loading states and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository** (or you're already in it)
   ```bash
   cd d:\test\hos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The `.env` file is already configured with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://mebxqdtfukdcmjcpvdvr.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Set up Supabase Database**
   
   a. Go to your Supabase Dashboard: https://supabase.com/dashboard
   
   b. Navigate to the SQL Editor
   
   c. Copy the contents of `supabase_schema.sql` and run it in the SQL Editor
   
   This will create all necessary tables and set up Row Level Security (RLS) policies.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📊 Database Schema

### Tables Created:
- **profiles**: User information with roles
- **appointments**: Appointment bookings between patients and doctors
- **patients**: Patient records
- **schedules**: Doctor availability slots
- **notices**: System-wide announcements
- **attendance**: Staff/Doctor attendance tracking

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies ensure users can only access their own data
- Admins have broader access rights

## 🧪 Testing the Application

### Create Test Accounts

1. **Admin Account**
   - Register with role: Admin
   - Email: admin@test.com
   - Password: admin123

2. **Doctor Account**
   - Register with role: Doctor
   - Select a specialization
   - Email: doctor@test.com
   - Password: doctor123

3. **Staff Account**
   - Register with role: Staff
   - Email: staff@test.com
   - Password: staff123

4. **Patient Account**
   - Register with role: Patient
   - Email: patient@test.com
   - Password: patient123

### Testing Flow

1. **As Patient**:
   - Login and book an appointment with a doctor
   - Select date and time
   - Wait for real-time status update

2. **As Doctor**:
   - Login and see the pending appointment request
   - Accept or reject the appointment
   - Patient receives real-time notification

3. **As Staff**:
   - Login and mark attendance
   - View today's appointments
   - Use "Assist Doctor" to see doctor's schedule

4. **As Admin**:
   - Login and view system statistics
   - Send a notice to all users
   - Monitor real-time updates

## 🔄 Real-Time Features

### Supabase Realtime Channels

The application uses Supabase Realtime to provide instant updates:

- **Admin Dashboard**: Updates when new appointments or users are added
- **Doctor Dashboard**: Notifies when new appointment requests arrive
- **Patient Dashboard**: Updates appointment status instantly when doctor accepts/rejects

Example subscription code:
```javascript
const channel = supabase
  .channel('appointments')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'appointments' }, 
    (payload) => {
      // Handle real-time updates
    }
  )
  .subscribe()
```

## 📁 Project Structure

```
src/
├── components/
│   ├── DashboardCard.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Admin/
│   │   └── Dashboard.jsx
│   ├── Doctor/
│   │   └── Dashboard.jsx
│   ├── Staff/
│   │   └── Dashboard.jsx
│   └── Patient/
│       └── Dashboard.jsx
├── utils/
│   └── supabaseClient.js
├── App.jsx
└── main.jsx
```

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Backend & Auth**: Supabase
- **Routing**: React Router DOM v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Protected routes with role verification
- Secure authentication with Supabase Auth
- Environment variables for sensitive data
- Input validation on all forms

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🎨 Color Scheme

- **Admin**: Blue (#3B82F6) & Indigo (#6366F1)
- **Doctor**: Green (#10B981) & Emerald (#059669)
- **Staff**: Orange (#F97316) & Red (#EF4444)
- **Patient**: Teal (#14B8A6) & Cyan (#06B6D4)

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Check your `.env` file has the correct Supabase credentials
   - Restart the dev server after changing `.env`

2. **Database Connection Issues**
   - Ensure you've run the SQL schema in Supabase
   - Check Supabase project is active

3. **Real-time Not Working**
   - Enable Realtime in Supabase Dashboard
   - Check the tables are published for realtime

4. **Authentication Errors**
   - Check email confirmation settings in Supabase Auth
   - Verify RLS policies are correctly set up

## 📝 Additional Notes

- **Email Confirmation**: By default, Supabase requires email confirmation. For testing, you can disable this in Supabase Dashboard → Authentication → Settings
- **Password Requirements**: Minimum 6 characters
- **Time Zones**: All timestamps are in UTC

## 🚀 Deployment

To deploy to production:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

3. Set environment variables in your hosting platform

## 📄 License

This project is created for demonstration purposes.

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check the code comments for implementation details

## 🎉 Congratulations!

You now have a fully functional Hospital Management System with real-time features, role-based access, and a modern UI. Happy coding! 🚀
