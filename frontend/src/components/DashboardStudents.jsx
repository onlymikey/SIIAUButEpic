import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {
  MdCalendarToday,
  MdCalendarMonth,
  MdAccountBalance,
  MdInsertDriveFile,
  MdLogin,
  MdNotificationImportant,
} from "react-icons/md";
import { getUserGroups } from '../services/api';


const DashboardStudents = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await getUserGroups(userId);
        const groups = response.groups || [];
        const allSchedules = groups.flatMap(group => 
          group.schedules.map(schedule => ({
            ...schedule,
            subjectName: group.subject.name
          }))
        );
        setSchedules(allSchedules);
      } catch (error) {
        console.error('Error al obtener los grupos del usuario:', error);
      }
    };

    fetchUserGroups();
  }, []);



  return (
    <div className="p-10 max-w-6xl mx-auto bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-lg">
      {/* Título del Dashboard */}
      <h1 className="text-white font-bold text-4xl text-center mb-6">Dashboard</h1>

      {/* Bienvenida */}
      <div className="bg-blue-800 text-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-center">
          Bienvenido, {localStorage.getItem('user')}!
        </h2>
      </div>

      {/* Contenedor de Mi Horario y Avisos */}
      <div className=" gap-6 mb-6">
        {/* Mi Horario */}
        <div className="col-span-2 bg-gray-800 text-white rounded-lg shadow-lg">
          <div className="flex items-center p-4 border-b border-gray-600">
            <MdCalendarToday className="text-2xl mr-2" />
            <h3 className="text-xl font-semibold">Mi horario</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-center text-white border-collapse">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2">HORA</th>
                  <th className="px-8">L</th>
                  <th className="px-8">M</th>
                  <th className="px-8">I</th>
                  <th className="px-8">J</th>
                  <th className="px-8">V</th>
                  <th className="px-8">S</th>
                </tr>
              </thead>
              <tbody>
                {["07:00-09:00", "09:00-11:00", "11:00-13:00", "13:00-15:00","15:00-17:00","17:00-19:00"].map((hora) => (
                  <tr key={hora} className="border-b border-gray-600">
                    <td className="py-2">{hora}</td>
                    {["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"].map((day) => (
                      <td key={day}>
                        {schedules
                          .filter(schedule => schedule.day === day && schedule.start_at === hora.split('-')[0])
                          .map(schedule => (
                            <div key={schedule.start_at + schedule.day}>{schedule.subjectName}</div>
                          ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Botones */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: "Registrar materias", icon: <MdCalendarMonth />, color: "bg-blue-600", path: "/EnrollCourses" },
          { label: "Oferta Académica", icon: <MdAccountBalance />, color: "bg-green-600", path: "/AcademicsPrograms" },
        ].map((button) => (
          <Link key={button.label} to={button.path} className={`p-4 rounded-lg shadow-lg text-white text-center ${button.color}`}>
            <div className="text-2xl mb-2">{button.icon}</div>
            <div className="text-lg font-semibold">{button.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardStudents;