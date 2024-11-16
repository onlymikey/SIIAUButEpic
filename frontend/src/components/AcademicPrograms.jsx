import React from "react";

const AcademicOffer = () => {
  return (
    <div className="p-10 max-w-6xl mx-auto bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-lg">
      {/* Título */}
      <h1 className="text-white font-bold text-4xl text-center mb-8">
        Oferta Académica
      </h1>

      {/* Select de Carrera */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <label className="block text-white font-medium text-lg mb-2">
          Carrera
        </label>
        <select
          className="w-full bg-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Selecciona una carrera"
        >
          {/* Opciones de carreras */}
          <option value="">Selecciona una carrera</option>
          <option value="carrera1">Ingeniería en Sistemas</option>
          <option value="carrera2">Licenciatura en Administración</option>
          <option value="carrera3">Medicina</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <table className="w-full table-auto text-white border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-3 px-4">CLAVE</th>
              <th className="py-3 px-4">MATERIA</th>
              <th className="py-3 px-4">CUPOS</th>
              <th className="py-3 px-4">PROFESOR</th>
              <th className="py-3 px-4">HORARIO</th>
              <th className="py-3 px-4">AULA</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, index) => (
              <tr
                key={index}
                className="border-b border-gray-600 text-center hover:bg-gray-700"
              >
                <td className="py-2 px-4">Text</td>
                <td className="py-2 px-4">Text</td>
                <td className="py-2 px-4">Text</td>
                <td className="py-2 px-4">Text</td>
                <td className="py-2 px-4">Text</td>
                <td className="py-2 px-4">Text</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicOffer;
