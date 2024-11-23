import React, { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem, DateInput, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { getGroupById, createGroup, updateGroup, deleteGroup, getTeachers, getClassrooms, getCareers, getSubjects } from '../services/api';

export default function Groups() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        start_date: '',
        end_date: '',
        subject: '',
        teacher: '',
        semester: '',
        max_students: '',
        classroom: '',
        career: ''
    });
    const [errors, setErrors] = useState({});
    const [hasSearched, setHasSearched] = useState(false);
    const [popoverContent, setPopoverContent] = useState('');
    const [showPopover, setShowPopover] = useState(false);
    const [popoverTarget, setPopoverTarget] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [confirmDeactivate, setConfirmDeactivate] = useState(false);
    const [deactivateTimeout, setDeactivateTimeout] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [careers, setCareers] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teachersData = await getTeachers();
                const classroomsData = await getClassrooms();
                const careersData = await getCareers();
                const subjectsData = await getSubjects();
                setTeachers(teachersData);
                setClassrooms(classroomsData);
                setCareers(careersData);
                setSubjects(subjectsData);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await getGroupById(formData.id);
            setFormData({
                ...formData,
                name: data.name || '',
                start_date: data.start_date || '',
                end_date: data.end_date || '',
                subject: data.subject || '',
                teacher: data.teacher || '',
                semester: data.semester || '',
                max_students: data.max_students || '',
                classroom: data.classroom || '',
                career: data.career || ''
            });
            setIsEditing(false);
            setHasSearched(true);
            setPopoverTarget('search');
            setPopoverContent('Búsqueda realizada correctamente');
            setShowPopover(true);
            setTimeout(() => setShowPopover(false), 10000);
        } catch (error) {
            console.error('Error al buscar el grupo:', error);
            setPopoverContent('Error al buscar el grupo');
            setPopoverTarget('search');
            setShowPopover(true);
            setTimeout(() => setShowPopover(false), 10000);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            name: formData.name,
            start_date: formData.start_date,
            end_date: formData.end_date,
            subject: formData.subject,
            teacher: formData.teacher,
            semester: formData.semester,
            max_students: formData.max_students,
            classroom: formData.classroom,
            career: formData.career
        };

        try {
            let response;
            if (hasSearched) {
                response = await updateGroup(formData.id, data);
                if (response.status === 200) {
                    setPopoverContent('Datos actualizados correctamente');
                    setPopoverTarget('save');
                    console.log('Datos actualizados exitosamente:', response.data);
                    handleCancel();
                }
            } else {
                response = await createGroup(data);
                if (response.status === 201) {
                    setPopoverContent('Datos guardados correctamente');
                    setPopoverTarget('save');
                    console.log('Datos enviados exitosamente:', response.data);
                    handleCancel();
                }
            }
            setShowPopover(true);
            setTimeout(() => setShowPopover(false), 10000);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const validationErrors = error.response.data;
                const newErrors = {};
                console.log('Errores de validación:', validationErrors);

                for (const key in validationErrors) {
                    if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
                        newErrors[key] = validationErrors[key][0];
                    }
                }
                setErrors(newErrors);
                setPopoverContent('Error al guardar los datos');
                setPopoverTarget('save');
            } else {
                console.error('Error al enviar los datos:', error);
                setErrors({ general: 'Error al enviar los datos' });
                setPopoverContent('Error al enviar los datos');
                setPopoverTarget('save');
            }
            setShowPopover(true);
            setTimeout(() => setShowPopover(false), 10000);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        if (!confirmDeactivate) {
            setPopoverContent('¿Estás seguro de querer eliminar este grupo? Si estás seguro, pulsa el botón otra vez.');
            setPopoverTarget('deactivate');
            setShowPopover(true);
            setConfirmDeactivate(true);

            // Establecer un temporizador para restablecer la confirmación después de 10 segundos
            const timeout = setTimeout(() => {
                setConfirmDeactivate(false);
            }, 10000);
            setDeactivateTimeout(timeout);
            return;
        }

        // Si se confirma la eliminación, proceder con la eliminación del grupo
        setLoading(true);
        try {
            await deleteGroup(formData.id);
            setPopoverContent('Grupo eliminado correctamente');
            setPopoverTarget('deactivate');
            handleCancel();
            setShowPopover(true);
            setTimeout(() => setShowPopover(false), 10000);
        } catch (error) {
            console.error('Error al eliminar el grupo:', error);
            setPopoverContent('Error al eliminar el grupo');
            setPopoverTarget('deactivate');
            setShowPopover(true);
            setTimeout(() => setShowPopover(false), 10000);
        } finally {
            setLoading(false);
            setConfirmDeactivate(false);
            clearTimeout(deactivateTimeout);
        }
    };

    const handleNew = () => {
        setIsEditing(true);
        setIsNew(true);
        setFormData({
            id: '',
            name: '',
            start_date: '',
            end_date: '',
            subject: '',
            teacher: '',
            semester: '',
            max_students: '',
            classroom: '',
            career: ''
        });
        setErrors({});
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setHasSearched(false);
        setIsNew(false);
        setFormData({
            id: '',
            name: '',
            start_date: '',
            end_date: '',
            subject: '',
            teacher: '',
            semester: '',
            max_students: '',
            classroom: '',
            career: ''
        });
        setErrors({});
    };

    const handlePopoverChange = (isOpen) => {
        setShowPopover(isOpen);
        if (!isOpen) {
            setPopoverContent('');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg">
            <h2 className="text-foreground font-sans font-extrabold text-3xl justify-center items-center text-center mb-6">Grupos</h2>

            <div className="p-6 bg-transparent rounded-lg">
                {/* Buscar y Código de Grupo */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <Input
                                placeholder="Ej. 12345"
                                label="Código de grupo"
                                variant='bordered'
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex items-end space-x-2 pb-2">
                            <Popover placement="bottom" showArrow={true} isOpen={showPopover && popoverTarget === 'search'} onOpenChange={handlePopoverChange}>
                                <PopoverTrigger>
                                    <Button color="primary" variant='flat' onClick={handleSearch} isDisabled={isEditing || hasSearched}>Buscar</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="px-1 py-2">
                                        <div className="text-small font-bold">{popoverContent}</div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button color="secondary" variant='flat' onClick={handleEdit} isDisabled={!hasSearched || isEditing}>Editar</Button>
                            <Popover placement="bottom" showArrow={true} isOpen={showPopover && popoverTarget === 'deactivate'} onOpenChange={handlePopoverChange}>
                                <PopoverTrigger>
                                    <Button color="danger" variant='flat' onClick={handleDeactivate} isDisabled={!hasSearched || isEditing}>Baja</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    {(titleProps) => (
                                        <div className="px-1 py-2">
                                            <h3 className="text-small font-bold" {...titleProps}>
                                                Confirmación
                                            </h3>
                                            <div className="text-tiny">
                                                {popoverContent}
                                            </div>
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                {/* Formulario de Información de Grupo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input isDisabled label="ID" placeholder="12345" variant="bordered" value={formData.id} />
                    <Input isRequired label="Nombre de Grupo" placeholder="Ej. Grupo A" variant="bordered" isDisabled={!isEditing} name="name" value={formData.name} onChange={handleInputChange} errorMessage={errors.name} isInvalid={!!errors.name} />
                    <DateInput isRequired label="Fecha de Inicio" placeholder="dd/mm/yyyy" variant="bordered" className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="start_date" value={formData.start_date} onChange={handleInputChange} errorMessage={errors.start_date} isInvalid={!!errors.start_date} />
                    <DateInput isRequired label="Fecha de Fin" placeholder="dd/mm/yyyy" variant="bordered" className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="end_date" value={formData.end_date} onChange={handleInputChange} errorMessage={errors.end_date} isInvalid={!!errors.end_date} />
                    <Select isRequired label="Materia" placeholder="Selecciona una materia" variant='bordered' className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="subject" value={formData.subject} onChange={handleInputChange} errorMessage={errors.subject} isInvalid={!!errors.subject}>
                        {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                {subject.name}
                            </SelectItem>
                        ))}
                    </Select>
                    <Select isRequired label="Maestro" placeholder="Selecciona un maestro" variant='bordered' className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="teacher" value={formData.teacher} onChange={handleInputChange} errorMessage={errors.teacher} isInvalid={!!errors.teacher}>
                        {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                {teacher.name}
                            </SelectItem>
                        ))}
                    </Select>
                    <Select isRequired label="Semestre" placeholder="Selecciona un semestre" variant='bordered' className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="semester" value={formData.semester} onChange={handleInputChange} errorMessage={errors.semester} isInvalid={!!errors.semester}>
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <Input isRequired label="Máximo de Alumnos" placeholder="Ej. 30" variant="bordered" isDisabled={!isEditing} name="max_students" value={formData.max_students} onChange={handleInputChange} errorMessage={errors.max_students} isInvalid={!!errors.max_students} />
                    <Select isRequired label="Salón" placeholder="Selecciona un salón" variant='bordered' className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="classroom" value={formData.classroom} onChange={handleInputChange} errorMessage={errors.classroom} isInvalid={!!errors.classroom}>
                        {classrooms.map((classroom) => (
                            <SelectItem key={classroom.id} value={classroom.id.toString()}>
                                {classroom.name}
                            </SelectItem>
                        ))}
                    </Select>
                    <Select isRequired label="Carrera" placeholder="Selecciona una carrera" variant='bordered' className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="career" value={formData.career} onChange={handleInputChange} errorMessage={errors.career} isInvalid={!!errors.career}>
                        {careers.map((career) => (
                            <SelectItem key={career.id} value={career.id.toString()}>
                                {career.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-around mt-6">
                    <Button color="success" variant='flat' onClick={handleNew} isDisabled={isNew || hasSearched}>Nuevo</Button>
                    <Popover placement="bottom" showArrow={true} isOpen={showPopover && popoverTarget === 'save'} onOpenChange={handlePopoverChange}>
                        <PopoverTrigger>
                            <Button color="primary" variant='flat' onClick={handleSave} isDisabled={!isEditing || loading || Object.values(errors).some(error => error)} isLoading={loading}>Guardar</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">{popoverContent}</div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button color="default" variant='flat' onClick={handleCancel} isDisabled={!isNew && !hasSearched}>Cancelar</Button>
                </div>
            </div>
        </div>
    );
}