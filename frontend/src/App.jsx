import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginCard from "./components/LoginCard";
import Sidebar from "./components/Sidebar";
import Users from "./components/Users";
import Subjects from "./components/Subjects";
import Groups from "./components/Groups";
import Careers from "./components/Careers";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import DashboardStudents from "./components/DashboardStudents";
import AcademicOffer from "./components/AcademicPrograms"; 

export default function App() {
  const userRole = 'admin';

  return (
    <Router>
      <div className="dark text-foreground bg-gradient-to-bl from-slate-900 to-indigo-900 w-full h-screen flex">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/*" element={
            <PrivateRoute>
              <div className="flex w-full h-full">
                <Sidebar role={userRole} />
                <div className="flex-grow flex items-center justify-center">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/subjects" element={<Subjects />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/DashboardStudents" element={<DashboardStudents />} />
                    <Route path="/AcademicsPrograms" element={<AcademicOffer />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}