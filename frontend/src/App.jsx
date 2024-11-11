import { useState } from 'react';
import LoginCard from "./components/LoginCard";
import Sidebar from "./components/Sidebar";

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
        {currentSection === 'Settings' && <div>Settings Component</div>}
        {currentSection === 'Support' && <div>Support Component</div>}
        {currentSection === 'Profile' && <div>Profile Component</div>}
      </div>
    </div>
  );
}