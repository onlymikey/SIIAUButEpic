import { useState } from 'react';
import { FaHome, FaUser, FaBook, FaUsers, FaGraduationCap, FaBars, FaPowerOff } from 'react-icons/fa';
import { Button } from '@nextui-org/react';
import Ripples from 'react-ripples';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ role }) {
    const [visible, setVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState('Home');
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setVisible(!visible);
    };

    const handleSectionClick = (section) => {
        setSelectedSection(section);
        navigate(`/${section.toLowerCase()}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    return (
        <>
            <Button 
                onClick={toggleSidebar}
                auto
                isIconOnly
                startContent={<FaBars size={30} />}
                className="fixed top-2 left-2 z-50 bg-transparent text-white"
            />
            <div className={`fixed inset-y-0 left-0 transform ${visible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg w-64 h-screen overflow-y-auto z-40`}>
                <nav className="mt-16">
                    <ul>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'Home' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('Dashboard')}>
                                    <FaHome className="w-5 h-5 mr-3" />
                                    <span>Home</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'Users' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('Users')}>
                                    <FaUser className="w-5 h-5 mr-3" />
                                    <span>Usuarios</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'Subjects' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('Subjects')}>
                                    <FaBook className="w-5 h-5 mr-3" />
                                    <span>Materias</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'Groups' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('Groups')}>
                                    <FaUsers className="w-5 h-5 mr-3" />
                                    <span>Grupos</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'Careers' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('Careers')}>
                                    <FaGraduationCap className="w-5 h-5 mr-3" />
                                    <span>Carreras</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'DashboardStudents' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('DashboardStudents')}>
                                    <FaGraduationCap className="w-5 h-5 mr-3" />
                                    <span>DashStudents</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'AcademicsPrograms' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('AcademicsPrograms')}>
                                    <FaGraduationCap className="w-5 h-5 mr-3" />
                                    <span>Oferta Academica</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className="flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none hover:bg-gray-700 hover:bg-opacity-50" onClick={handleLogout}>
                                    <FaPowerOff className="w-5 h-5 mr-3" />
                                    <span>Cerrar sesión</span>
                                </div>
                            </Ripples>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}