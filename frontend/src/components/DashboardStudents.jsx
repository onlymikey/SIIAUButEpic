import React from "react";
import { Link } from "react-router-dom";
import {
  MdCalendarMonth,
  MdCalendarToday,
  MdAccountBalance,
  MdInsertDriveFile,
  MdLogin,
  MdNotificationImportant,
} from "react-icons/md";

const DashboardStudents = () => {
  return (
    <div className="p-10 max-w-6xl mx-auto bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-lg">
      {/* Título del Dashboard */}
      <h1 className="text-white font-bold text-4xl text-center mb-6">
        Dashboard
      </h1>

      {/* Bienvenida */}
      <div className="bg-blue-800 text-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-center">
          Bienvenido XXXXX (estudiante / profesor)
        </h2>
      </div>

      {/* Contenedor de Mi Horario y Avisos */}
      <div className="grid grid-cols-3 gap-6 mb-6">
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
                  <th>L</th>
                  <th>M</th>
                  <th>I</th>
                  <th>J</th>
                  <th>V</th>
                </tr>
              </thead>
              <tbody>
                {["07:00-09:00", "09:00-11:00", "11:00-13:00", "13:00-15:00"].map((hora) => (
                  <tr key={hora} className="border-b border-gray-600">
                    <td className="py-2">{hora}</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Avisos */}
        <div className="bg-gray-800 text-white rounded-lg shadow-lg">
          <div className="flex items-center p-4 border-b border-gray-600">
            <MdNotificationImportant className="text-2xl mr-2" />
            <h3 className="text-xl font-semibold">Avisos</h3>
          </div>
          <div className="p-4">
            <ul className="list-disc list-inside">
              <li>AVISO 1</li>
              <li>AVISO 2</li>
              <li>AVISO 3</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "Registrar materias", icon: <MdCalendarMonth />, color: "bg-blue-600", path: "/EnrollCourses" },
          { label: "Oferta Académica", icon: <MdAccountBalance />, color: "bg-green-600", path: "/AcademicsPrograms" },
          { label: "Kardex", icon: <MdInsertDriveFile />, color: "bg-yellow-600", path: "#" },
          { label: "Cerrar Sesión", icon: <MdLogin />, color: "bg-red-600", path: "#" },
        ].map((button) => (
          <Link
            to={button.path}
            key={button.label}
            className={`${button.color} flex flex-col items-center justify-center p-6 rounded-lg shadow-lg hover:scale-105 transform transition`}
          >
            <div className="text-3xl text-white mb-2">{button.icon}</div>
            <span className="text-white font-semibold">{button.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardStudents;
