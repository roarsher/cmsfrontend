 import Footer from "./components/layout/Footer";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/layout/Navbar";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
import TeacherLayout from "./layouts/TeacherLayout";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTeachers from "./pages/admin/ManageTeachers";
import Notices from "./pages/admin/Notices";
import FeeManagement from "./pages/admin/FeeManagement";   // ✅ NEW
import AdminRoutine from "./pages/admin/AdminRoutine";


// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import Attendance from "./pages/student/Attendance";
import Marks from "./pages/student/Marks";
import StudentFees from "./pages/student/StudentFees";      // ✅ NEW
import StudentLiveAttendance from "./pages/student/StudentLiveAttendance"; // ✅ NEW
// Teacher
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AddMarks from "./pages/teacher/AddMarks";
import Bg from './components/layout/Bg';
import AiHelpdesk from "./components/common/AiHelpdesk";
import LiveAttendance from "./pages/teacher/LiveAttendance";

function App() {
  return (
    <Bg>
      <AuthProvider>
        <Navbar />
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ADMIN */}
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="managestudents" element={<ManageStudents />} />
            <Route path="manageteachers" element={<ManageTeachers />} />
            <Route path="notices" element={<Notices />} />
            <Route path="fees" element={<FeeManagement />} />
            <Route path="routines" element={<AdminRoutine />} />
          </Route>

          {/* STUDENT */}
          <Route path="/student" element={<ProtectedRoute roles={["student"]}><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="marks" element={<Marks />} />
            <Route path="fees" element={<StudentFees />} />
             <Route path="live-attendance" element={<StudentLiveAttendance />} />
          </Route>

          {/* TEACHER */}
          <Route path="/teacher" element={<ProtectedRoute roles={["teacher"]}><TeacherLayout /></ProtectedRoute>}>
            <Route index element={<TeacherDashboard />} />
            <Route path="add-marks" element={<AddMarks />} />
            
           <Route path="live-attendance" element={<LiveAttendance />} />
            
          
          </Route>

        </Routes>
        <AiHelpdesk />
      </AuthProvider>
      <Footer />
    </Bg>
  );
}

export default App;