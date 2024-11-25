import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginCard from "./components/LoginCard";
import Sidebar from "./components/Sidebar";
import Users from "./components/Users";
import Subjects from "./components/Subjects";
import Groups from "./components/Groups";
import Careers from "./components/Careers";
import PrivateRoute from "./components/PrivateRoute";
import DashboardStudents from "./components/DashboardStudents";
import Dashboard from "./components/Dashboard";
import AcademicOffer from "./components/AcademicPrograms";
import RegistrarMaterias from "./components/EnrollCourses";  
import Classroom from "./components/Classroom"; 
import { useEffect, useState } from 'react';

export default function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, []);

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
                    {userRole === 'career_admin' && (
                      <>
                        <Route path="/Dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/subjects" element={<Subjects />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/AcademicsPrograms" element={<AcademicOffer />} />
                        <Route path="/EnrollCourses" element={<RegistrarMaterias />} />
                        <Route path="/Classroom" element={<Classroom />} />
                      </>
                    )}
                    {userRole === 'student' && (
                      <>
                        <Route path="/DashboardStudents" element={<DashboardStudents />} />
                        <Route path="/AcademicsPrograms" element={<AcademicOffer />} />
                        <Route path="/EnrollCourses" element={<RegistrarMaterias />} />
                      </>
                    )}
                    {userRole === 'teacher' && (
                      <>
                        {/* Add routes for teacher if needed */}
                      </>
                    )}
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