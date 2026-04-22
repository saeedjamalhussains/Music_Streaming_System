import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import UserDashboard from "@/user/Dashboard"
import AdminLayout from "@/admin/AdminLayout"
import AdminDashboard from "@/admin/AdminDashboard"
import SongManager from "@/admin/SongManager"
import UploadForm from "@/admin/UploadForm"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User */}
          <Route path="/app" element={
            <ProtectedRoute><UserDashboard /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="songs" element={<SongManager />} />
            <Route path="upload" element={<UploadForm />} />
            <Route path="edit/:id" element={<UploadForm />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
