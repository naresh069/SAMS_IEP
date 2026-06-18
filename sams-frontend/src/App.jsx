import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Landing from './pages/Landing.jsx'
import TeacherLogin from './pages/auth/TeacherLogin.jsx'
import TeacherRegister from './pages/auth/TeacherRegister.jsx'
import StudentLogin from './pages/auth/StudentLogin.jsx'

import ProtectedRoute from './routes/ProtectedRoute.jsx'
import TeacherLayout from './layouts/TeacherLayout.jsx'
import StudentLayout from './layouts/StudentLayout.jsx'

import TDashboard from './pages/teacher/Dashboard.jsx'
import TStudents from './pages/teacher/Students.jsx'
import TAddStudent from './pages/teacher/AddStudent.jsx'
import TEditStudent from './pages/teacher/EditStudent.jsx'
import TStudentDetails from './pages/teacher/StudentDetails.jsx'
import TMarkAttendance from './pages/teacher/MarkAttendance.jsx'
import TUpdateAttendance from './pages/teacher/UpdateAttendance.jsx'
import TReports from './pages/teacher/Reports.jsx'
import TAnalytics from './pages/teacher/Analytics.jsx'
import TProfile from './pages/teacher/Profile.jsx'

import SDashboard from './pages/student/Dashboard.jsx'
import SAttendance from './pages/student/MyAttendance.jsx'
import SPercentage from './pages/student/Percentage.jsx'
import SAnalytics from './pages/student/Analytics.jsx'
import SProfile from './pages/student/Profile.jsx'

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/register/teacher" element={<TeacherRegister />} />
        <Route path="/login/student" element={<StudentLogin />} />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="TEACHER">
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TDashboard />} />
          <Route path="students" element={<TStudents />} />
          <Route path="students/new" element={<TAddStudent />} />
          <Route path="students/:id" element={<TStudentDetails />} />
          <Route path="students/:id/edit" element={<TEditStudent />} />
          <Route path="attendance/mark" element={<TMarkAttendance />} />
          <Route path="attendance/update" element={<TUpdateAttendance />} />
          <Route path="reports" element={<TReports />} />
          <Route path="analytics" element={<TAnalytics />} />
          <Route path="profile" element={<TProfile />} />
        </Route>

        <Route
          path="/student"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SDashboard />} />
          <Route path="attendance" element={<SAttendance />} />
          <Route path="percentage" element={<SPercentage />} />
          <Route path="analytics" element={<SAnalytics />} />
          <Route path="profile" element={<SProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
