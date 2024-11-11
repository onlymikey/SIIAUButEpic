/**
 * v0 by Vercel.
 * @see https://v0.dev/t/meMZYVbZzmf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useState } from 'react';
import { FaHome, FaCog, FaPowerOff, FaUser, FaBars } from 'react-icons/fa';
import { Button } from '@nextui-org/react';
import Ripples from 'react-ripples';

export default function Sidebar({ role, onSectionChange }) {
    const [visible, setVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState('Home');

    const toggleSidebar = () => {
        setVisible(!visible);
    };

    const handleSectionClick = (section) => {
        setSelectedSection(section);
        onSectionChange(section); // Llama a la función de cambio de sección
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
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'Home' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('Home')}>
                                    <FaHome className="w-5 h-5 mr-3" />
                                    <span>Home</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'Settings' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('Settings')}>
                                    <FaCog className="w-5 h-5 mr-3" />
                                    <span>Settings</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'Support' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('Support')}>
                                    <FaPowerOff className="w-5 h-5 mr-3" />
                                    <span>Support</span>
                                </div>
                            </Ripples>
                        </li>
                        <li className="mx-2 my-1">
                            <Ripples className="w-full rounded-md" during={600}>
                                <div className={`flex items-center w-full h-full rounded-md p-2 transition duration-200 ease-in-out cursor-pointer select-none ${selectedSection === 'Profile' ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-700 hover:bg-opacity-50'}`} onClick={() => handleSectionClick('Profile')}>
                                    <FaUser className="w-5 h-5 mr-3" />
                                    <span>Profile</span>
                                </div>
                            </Ripples>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}