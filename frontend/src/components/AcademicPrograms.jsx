import React, { useState, useEffect } from "react";
import { getGroups, getSubjectById, getUserById, getClassroomById } from '../services/api';

const AcademicOffer = () => {
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [teachers, setTeachers] = useState({});
  const [classrooms, setClassrooms] = useState({});

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroups();
        setGroups(data);

        // Obtener detalles de materias, profesores y aulas
        const subjectPromises = data.map(group => getSubjectById(group.subject));
        const teacherPromises = data.map(group => getUserById(group.teacher));
        const classroomPromises = data.map(group => {
          if (group.classroom) {
            return getClassroomById(group.classroom);
          }
          return Promise.resolve(null);
        });

        const subjectsData = await Promise.all(subjectPromises);
        const teachersData = await Promise.all(teacherPromises);
        const classroomsData = await Promise.all(classroomPromises);

        const subjectsMap = {};
        const teachersMap = {};
        const classroomsMap = {};

        subjectsData.forEach(subject => {
          subjectsMap[subject.id] = subject.name;
        });

        teachersData.forEach(teacher => {
          teachersMap[teacher.id] = `${teacher.name} ${teacher.father_last_name} ${teacher.mother_last_name}`;
        });

        classroomsData.forEach(classroom => {
          if (classroom) {
            classroomsMap[classroom.id] = classroom.name;
          }
        });

        setSubjects(subjectsMap);
        setTeachers(teachersMap);
        setClassrooms(classroomsMap);
      } catch (error) {
        console.error('Error al obtener los grupos:', error);
      }
    };

    fetchGroups();
    console.table(groups)
  }, []);

  return (
    <div className="p-10 max-w-6xl mx-auto bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-lg">
      {/* Título */}
      <h1 className="text-white font-bold text-4xl text-center mb-8">
        Oferta Académica
      </h1>
      {/* Tabla */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <table className="w-full table-auto text-white border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-3 px-4">CLAVE</th>
              <th className="py-3 px-4">MATERIA</th>
              <th className="py-3 px-4">PROFESOR</th>
              <th className="py-3 px-4">AULA</th>
              <th className="py-3 px-4">Alumnos registrados</th>
              <th className="py-3 px-4">Max alumnos</th>
              <th className="py-3 px-4">Horario</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              <tr key={group.id} className="border-b border-gray-600">
                <td className="py-3 px-4">{group.id}</td>
                <td className="py-3 px-4">{subjects[group.subject]}</td>
                <td className="py-3 px-4">{teachers[group.teacher]}</td>
                <td className="py-3 px-4">{group.name}</td>
                <td className="py-3 px-4">{group.quantity_students}</td>
                <td className="py-3 px-4">{group.max_students}</td>
                <td className="py-3 px-4">
                  {group.schedules.map(schedule => (
                    <div key={schedule.id}>
                      {schedule.day}: {schedule.start_at} - {schedule.end_at}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicOffer;