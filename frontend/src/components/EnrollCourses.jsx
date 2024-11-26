import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { getGroups, getUserGroups, getSubjectById, getUserById, createEnrollment, deleteEnrollment, getEnrollments } from '../services/api'; // Asegúrate de importar las funciones correctas

const EnrollCourses = () => {
    const [availableGroups, setAvailableGroups] = useState([]);
    const [registeredGroups, setRegisteredGroups] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const userId = localStorage.getItem('userId');
    const [subjects, setSubjects] = useState({});
    const [teachers, setTeachers] = useState({});

    const loadGroups = async () => {
        try {
            const allGroups = await getGroups();
            const userGroups = await getUserGroups(userId);
            const allEnrollments = await getEnrollments();
            console.log(userGroups);

            setRegisteredGroups(userGroups);
            setEnrollments(allEnrollments);

            const filteredGroups = allGroups.filter(group => 
                !userGroups.some(userGroup => userGroup.id === group.id)
            );

            setAvailableGroups(filteredGroups);

            // Fetch teacher names
            const teacherIds = new Set(allGroups.map(group => group.teacher));
            const teacherPromises = Array.from(teacherIds).map(id => getUserById(id));
            const teacherResults = await Promise.all(teacherPromises);

            const teacherMap = {};
            teacherResults.forEach(teacher => {
                teacherMap[teacher.id] = teacher.name;
            });

            setTeachers(teacherMap);

            // Fetch subject names
            const subjectIds = new Set(allGroups.map(group => group.subject));
            const subjectPromises = Array.from(subjectIds).map(id => getSubjectById(id));
            const subjectResults = await Promise.all(subjectPromises);

            const subjectMap = {};
            subjectResults.forEach(subject => {
                subjectMap[subject.id] = subject.name;
            });

            setSubjects(subjectMap);

        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    useEffect(() => {
        loadGroups();
    }, [userId]);

    const guardarRegistro = async (materia) => {
        try {
            const enrollmentData = {
                user: userId,
                group: materia.id
            };
            await createEnrollment(enrollmentData);

            // Recargar los grupos después de registrar la materia
            await loadGroups();

            alert('Inscripción guardada con éxito');
        } catch (error) {
            console.error('Error al guardar la inscripción:', error);
            alert('Hubo un error al guardar la inscripción');
        }
    };

    const cancelarRegistro = async (materia) => {
        try {
            const userEnrollments = enrollments.filter(enrollment => enrollment.user === parseInt(userId));
            const enrollment = userEnrollments.find(enrollment => enrollment.group === materia.id);
            if (enrollment) {
                await deleteEnrollment(enrollment.id);

                // Recargar los grupos después de cancelar la inscripción
                await loadGroups();

                alert('Inscripción cancelada con éxito');
            } else {
                alert('No se encontró la inscripción para cancelar');
            }
        } catch (error) {
            console.error('Error al cancelar la inscripción:', error);
            alert('Hubo un error al cancelar la inscripción');
        }
    };

    return (
        <div className="p-10 max-w-6xl mx-auto bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-8">Registro de materias</h1>

            {/* Materias Registradas */}
            <div className="mb-8 p-5 border border-white rounded-lg">
                <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🚩</span>
                    <h3 className="text-xl font-bold">Materias registradas:</h3>
                </div>
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-white px-2 py-1">MATERIA</th>
                            <th className="border border-white px-2 py-1">CLAVE</th>
                            <th className="border border-white px-2 py-1">Alumnos registrados</th>
                            <th className="border border-white px-2 py-1">Max alumnos</th>
                            <th className="border border-white px-2 py-1">PROFESOR</th>
                            <th className="border border-white px-2 py-1">HORARIO</th>
                            <th className="border border-white px-2 py-1">AULA</th>
                            <th className="border border-white px-2 py-1">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registeredGroups.map((materia) => (
                            <tr key={materia.id}>
                                <td className="border border-white px-2 py-1">{subjects[materia.id]}</td>
                                <td className="border border-white px-2 py-1">{materia.id}</td>
                                <td className="border border-white px-2 py-1">{materia.quantity_students}</td>
                                <td className="border border-white px-2 py-1">{materia.max_students}</td>
                                <td className="border border-white px-2 py-1">{teachers[materia.teacher.id]}</td>
                                <td className="border border-white px-2 py-1">
                                    {materia.schedules.map(schedule => (
                                        <div key={schedule.id}>
                                            {schedule.day} {schedule.start_at} - {schedule.end_at}
                                        </div>
                                    ))}
                                </td>
                                <td className="border border-white px-2 py-1">{materia.name}</td>
                                <td className="border border-white px-2 py-1">
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant='flat'
                                        onClick={() => cancelarRegistro(materia)}
                                    >
                                        Cancelar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Materias Disponibles */}
            <div className="mb-8 p-5 border border-white rounded-lg">
                <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">📚</span>
                    <h3 className="text-xl font-bold">Materias disponibles:</h3>
                </div>
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-white px-2 py-1">MATERIA</th>
                            <th className="border border-white px-2 py-1">CLAVE</th>
                            <th className="border border-white px-2 py-1">Alumnos registrados</th>
                            <th className="border border-white px-2 py-1">Max alumnos</th>
                            <th className="border border-white px-2 py-1">PROFESOR</th>
                            <th className="border border-white px-2 py-1">HORARIO</th>
                            <th className="border border-white px-2 py-1">AULA</th>
                            <th className="border border-white px-2 py-1">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableGroups.map((materia) => (
                            <tr key={materia.id}>
                                <td className="border border-white px-2 py-1">{subjects[materia.subject]}</td>
                                <td className="border border-white px-2 py-1">{materia.id}</td>
                                <td className="border border-white px-2 py-1">{materia.quantity_students}</td>
                                <td className="border border-white px-2 py-1">{materia.max_students}</td>
                                <td className="border border-white px-2 py-1">{teachers[materia.teacher]}</td>
                                <td className="border border-white px-2 py-1">
                                    {materia.schedules.map(schedule => (
                                        <div key={schedule.id}>
                                            {schedule.day} {schedule.start_at} - {schedule.end_at}
                                        </div>
                                    ))}
                                </td>
                                <td className="border border-white px-2 py-1">{materia.name}</td>
                                <td className="border border-white px-2 py-1">
                                    <Button
                                        size="sm"
                                        color="success"
                                        variant='flat'
                                        onClick={() => guardarRegistro(materia)}
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

export default EnrollCourses;