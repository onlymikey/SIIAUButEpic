import React, { useState } from "react";
import { Button } from "@nextui-org/react";

const RegistrarMaterias = () => {
  const [materiasRegistradas, setMateriasRegistradas] = useState([]);
  const [materiasDisponibles, setMateriasDisponibles] = useState([
    { id: 1, materia: "Matemáticas", clave: "MAT101", cupos: 3, profesor: "Prof. Pérez", horario: "07:00-09:00", aula: "A1" },
    { id: 2, materia: "Física", clave: "FIS102", cupos: 2, profesor: "Prof. López", horario: "11:00-13:00", aula: "B2" },
    { id: 3, materia: "Química", clave: "QUI103", cupos: 2, profesor: "Prof. Ramírez", horario: "13:00-15:00", aula: "C3" },
  ]);

  // Mover de disponibles a registradas
  const registrarMateria = (id) => {
    const materia = materiasDisponibles.find((m) => m.id === id);
    setMateriasRegistradas([...materiasRegistradas, materia]);
    setMateriasDisponibles(materiasDisponibles.filter((m) => m.id !== id));
  };

  // Mover de registradas a disponibles
  const cancelarRegistro = (id) => {
    const materia = materiasRegistradas.find((m) => m.id === id);
    setMateriasDisponibles([...materiasDisponibles, materia]);
    setMateriasRegistradas(materiasRegistradas.filter((m) => m.id !== id));
  };

  return (
    <div className="p-10 max-w-6xl mx-auto bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-8">Registro de materias</h1>

      {/* Materias Registradas */}
      <div className="mb-8 p-5 border border-white rounded-lg">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🚩</span>
          <h3 className="text-xl font-bold">Materias registradas:</h3>
          <Button color="danger" variant='flat' className="ml-20">Cancelar Registros</Button>
          <Button color="success" variant='flat' className="ml-4">Guardar Registros</Button>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border border-white px-2 py-1">MATERIA</th>
              <th className="border border-white px-2 py-1">CLAVE</th>
              <th className="border border-white px-2 py-1">CUPOS</th>
              <th className="border border-white px-2 py-1">PROFESOR</th>
              <th className="border border-white px-2 py-1">HORARIO</th>
              <th className="border border-white px-2 py-1">AULA</th>
              <th className="border border-white px-2 py-1">ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {materiasRegistradas.map((materia) => (
              <tr key={materia.id}>
                <td className="border border-white px-2 py-1">{materia.materia}</td>
                <td className="border border-white px-2 py-1">{materia.clave}</td>
                <td className="border border-white px-2 py-1">{materia.cupos}</td>
                <td className="border border-white px-2 py-1">{materia.profesor}</td>
                <td className="border border-white px-2 py-1">{materia.horario}</td>
                <td className="border border-white px-2 py-1">{materia.aula}</td>
                <td className="border border-white px-2 py-1">
                  <Button
                    size="sm"
                    color="danger"
                    variant='flat'
                    onClick={() => cancelarRegistro(materia.id)}
                  >
                    Cancelar registro
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Materias Disponibles */}
      <div className="p-5 border border-white rounded-lg">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🚩</span>
          <h3 className="text-xl font-bold">Materias disponibles:</h3>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border border-white px-2 py-1">MATERIA</th>
              <th className="border border-white px-2 py-1">CLAVE</th>
              <th className="border border-white px-2 py-1">CUPOS</th>
              <th className="border border-white px-2 py-1">PROFESOR</th>
              <th className="border border-white px-2 py-1">HORARIO</th>
              <th className="border border-white px-2 py-1">AULA</th>
              <th className="border border-white px-2 py-1">ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {materiasDisponibles.map((materia) => (
              <tr key={materia.id}>
                <td className="border border-white px-2 py-1">{materia.materia}</td>
                <td className="border border-white px-2 py-1">{materia.clave}</td>
                <td className="border border-white px-2 py-1">{materia.cupos}</td>
                <td className="border border-white px-2 py-1">{materia.profesor}</td>
                <td className="border border-white px-2 py-1">{materia.horario}</td>
                <td className="border border-white px-2 py-1">{materia.aula}</td>
                <td className="border border-white px-2 py-1">
                  <Button
                    size="sm"
                    color="success"
                    variant='flat'
                    onClick={() => registrarMateria(materia.id)}
                  >
                    Registrar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrarMaterias;
