import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { getGroups, getUserGroups, getSubjectById, getUserById, createEnrollment } from '../services/api'; // Asegúrate de importar las funciones correctas

const EnrollCourses = () => {
    const [availableGroups, setAvailableGroups] = useState([]);
    const [registeredGroups, setRegisteredGroups] = useState([]);
    const userId = localStorage.getItem('userId');
    const [materiasRegistradas, setMateriasRegistradas] = useState([]);
    const [subjects, setSubjects] = useState({});
    const [teachers, setTeachers] = useState({});

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const allGroups = await getGroups();
                const userGroups = await getUserGroups(userId);

                setRegisteredGroups(userGroups);

                const filteredGroups = allGroups.filter(group => 
                    !userGroups.some(userGroup => userGroup.id === group.id)
                );

                setAvailableGroups(filteredGroups);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, [userId]);

    const guardarRegistros = async () => {
        try {
            const enrollmentPromises = materiasRegistradas.map(materia => {
                const enrollmentData = {
                    user: userId,
                    group: materia.id
                };
                return createEnrollment(enrollmentData);
            });

            await Promise.all(enrollmentPromises);
            alert('Inscripciones guardadas con éxito');
        } catch (error) {
            console.error('Error al guardar las inscripciones:', error);
            alert('Hubo un error al guardar las inscripciones');
        }
    };

    const cancelarRegistro = (id) => {
        setMateriasRegistradas(materiasRegistradas.filter(materia => materia.id !== id));
    };

    return (
        <div className="p-10 max-w-6xl mx-auto bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-8">Registro de materias</h1>

            {/* Materias Registradas */}
            <div className="mb-8 p-5 border border-white rounded-lg">
                <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🚩</span>
                    <h3 className="text-xl font-bold">Materias registradas:</h3>
                    <Button color="danger" variant='flat' className="ml-20" onClick={() => setMateriasRegistradas([])}>Cancelar Registros</Button>
                    <Button color="success" variant='flat' className="ml-4" onClick={guardarRegistros}>Guardar Registros</Button>
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
                                        color="danger"
                                        variant='flat'
                                        onClick={() => cancelarRegistro(materia.id)}
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
                                        onClick={() => setMateriasRegistradas([...materiasRegistradas, materia])}
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