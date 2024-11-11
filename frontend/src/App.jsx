import { useState } from 'react';
import LoginCard from "./components/LoginCard";
import Sidebar from "./components/Sidebar";
import Users from "./components/Users";
import Subjects from "./components/Subjects";
import Groups from "./components/Groups";
import Careers from "./components/Careers";

export default function App() {
  const [currentSection, setCurrentSection] = useState('Home');
  const userRole = 'admin';

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  return (
    <div className="dark text-foreground bg-gradient-to-bl from-slate-900 to-indigo-900 w-full h-screen flex">
      <Sidebar role={userRole} onSectionChange={handleSectionChange} />
      <div className="flex-grow flex items-center justify-center">
        {currentSection === 'Home' && <LoginCard />}
        {currentSection === 'Users' && <Users />}
        {currentSection === 'Subjects' && <Subjects />}
        {currentSection === 'Groups' && <Groups />}
        {currentSection === 'Careers' && <Careers />}
      </div>
    </div>
  );
}