import React, { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem, DateInput, TimeInput, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { CalendarDate, Time } from '@internationalized/date';
import { getGroupById, createGroup, updateGroup, deleteGroup, getTeachers, getClassrooms, getCareers, getSubjects } from '../services/api';
import { days } from '../data/data';

export default function Groups() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        start_date: new CalendarDate(2000, 1, 1),
        end_date: new CalendarDate(2000, 1, 1),
        start_time: new Time(8, 0),
        end_time: new Time(10, 0),
        subject: '',
        teacher: '',
        study_period: '',
        max_students: '',
        classroom: '',
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
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teachersData = await getTeachers();
                const classroomsData = await getClassrooms();
                const subjectsData = await getSubjects();
                setTeachers(teachersData);
                setClassrooms(classroomsData);
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

    const handleDateChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const handleTimeChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const convertToCalendarDate = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split('-').map(Number);
        return new CalendarDate(year, month, day);
    };
    
    const formatDate = (date) => {
        const day = date.day.toString().padStart(2, '0');
        const month = date.month.toString().padStart(2, '0');
        const year = date.year.toString();
        return `${day}-${month}-${year}`;
    };

    const convertToTime = (timeString) => {
        if (!timeString) return null;
        const [hour, minute] = timeString.split(':').map(Number);
        return { hour, minute };
    };
    
    const formatTime = (time) => {
        if (!time) return '';
        const hour = time.hour.toString().padStart(2, '0');
        const minute = time.minute.toString().padStart(2, '0');
        return `${hour}:${minute}`;
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await getGroupById(formData.id);
            const schedule1 = data.schedule1 || {};
            setFormData({
                ...formData,
                name: data.name || '',
                start_date: convertToCalendarDate(data.start_date),
                end_date: convertToCalendarDate(data.end_date),
                start_time: convertToTime(schedule1.start_at),
                end_time: convertToTime(schedule1.end_at),
                day: schedule1.day || '',
                subject: data.subject || '',
                teacher: data.teacher || '',
                study_period: data.study_period || '',
                max_students: data.max_students || '',
                classroom: schedule1.classroom || '',
                career: data.career || ''
            });
            setIsEditing(false);
            setHasSearched(true);
            setPopoverTarget('search');
            setPopoverContent('Búsqueda realizada correctamente');
            console.log('Datos del grupo:', data);
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
            start_date: formatDate(formData.start_date),
            end_date: formatDate(formData.end_date),
            subject: parseInt(formData.subject),
            teacher: parseInt(formData.teacher),
            study_period: formData.study_period,
            max_students: parseInt(formData.max_students),
            schedule1: {
                day: formData.day,
                start_at: formatTime(formData.start_time),
                end_at: formatTime(formData.end_time),
                classroom: parseInt(formData.classroom)
            }
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
                        if (key === 'start_at') {
                            newErrors['start_time'] = validationErrors[key][0];
                        } else if (key === 'end_at') {
                            newErrors['end_time'] = validationErrors[key][0];
                        } else {
                            newErrors[key] = validationErrors[key][0];
                        }
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
            start_date: new CalendarDate(2000, 1, 1),
            end_date: new CalendarDate(2000, 1, 1),
            start_time: new Time(8, 0),
            end_time: new Time(10, 0),
            day: '',
            subject: '',
            teacher: '',
            study_period: '',
            max_students: '',
            classroom: '',
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
            start_date: new CalendarDate(2000, 1, 1),
            end_date: new CalendarDate(2000, 1, 1),
            start_time: new Time(8, 0),
            end_time: new Time(10, 0),
            day: '',
            subject: '',
            teacher: '',
            study_period: '',
            max_students: '',
            classroom: '',
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
                    <DateInput isRequired label="Fecha de Inicio" placeholderValue={new CalendarDate(2000, 1, 1)} variant="bordered" className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="start_date" value={formData.start_date} onChange={(value) => handleDateChange('start_date', value)} errorMessage={errors.start_date} isInvalid={!!errors.start_date} />
                    <DateInput isRequired label="Fecha de Fin" placeholderValue={new CalendarDate(2000, 1, 1)} variant="bordered" className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="end_date" value={formData.end_date} onChange={(value) => handleDateChange('end_date', value)} errorMessage={errors.end_date} isInvalid={!!errors.end_date} />
                    <TimeInput
                            variant="bordered"
                            isRequired
                            label="Hora de Inicio"
                            hourCycle={24}
                            granularity="minute"
                            isDisabled={!isEditing}
                            name="start_time"
                            value={formData.start_time}
                            onChange={(value) => handleDateChange('start_time', value)}
                            errorMessage={errors.start_time}
                            isInvalid={!!errors.start_time}
                        />
                        <TimeInput
                            variant="bordered"
                            isRequired
                            label="Hora de Fin"
                            hourCycle={24}
                            granularity="minute"
                            isDisabled={!isEditing}
                            name="end_time"
                            value={formData.end_time}
                            onChange={(value) => handleDateChange('end_time', value)}
                            errorMessage={errors.end_time}
                            isInvalid={!!errors.end_time}
                        />
                        <Select
                            isRequired
                            label="Día"
                            placeholder="Selecciona un día"
                            variant='bordered'
                            className="bg-transparent text-white rounded-md"
                            isDisabled={!isEditing}
                            name="day"
                            selectedKeys={formData.day ? new Set([formData.day]) : new Set()}
                            onSelectionChange={(keys) => handleInputChange({ target: { name: 'day', value: [...keys][0] } })}
                            errorMessage={errors.day}
                            isInvalid={!!errors.day}
                        >
                            {days.map((day) => (
                                <SelectItem key={day.key} value={day.key}>
                                    {day.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            isRequired
                            label="Materia"
                            placeholder="Selecciona una materia"
                            variant='bordered'
                            className="bg-transparent text-white rounded-md"
                            isDisabled={!isEditing}
                            name="subject"
                            selectedKeys={formData.subject ? new Set([formData.subject.toString()]) : new Set()}
                            onSelectionChange={(keys) => handleInputChange({ target: { name: 'subject', value: [...keys][0] } })}
                            errorMessage={errors.subject}
                            isInvalid={!!errors.subject}
                        >
                            {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                    {subject.name}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            isRequired
                            label="Profesor"
                            placeholder="Selecciona un profesor"
                            variant='bordered'
                            className="bg-transparent text-white rounded-md"
                            isDisabled={!isEditing}
                            name="teacher"
                            selectedKeys={formData.teacher ? new Set([formData.teacher.toString()]) : new Set()}
                            onSelectionChange={(keys) => handleInputChange({ target: { name: 'teacher', value: [...keys][0] } })}
                            errorMessage={errors.teacher}
                            isInvalid={!!errors.teacher}
                        >
                            {teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                    {teacher.name}
                                </SelectItem>
                            ))}
                        </Select>
                    <Input isRequired label="Ciclo Escolar" placeholder="2024A" variant="bordered" isDisabled={!isEditing} name="study_period" value={formData.study_period} onChange={handleInputChange} errorMessage={errors.study_period} isInvalid={!!errors.study_period} />
                    <Input isRequired label="Máximo de Alumnos" placeholder="Ej. 30" variant="bordered" isDisabled={!isEditing} name="max_students" value={formData.max_students} onChange={handleInputChange} errorMessage={errors.max_students} isInvalid={!!errors.max_students} />
                    <Select
                        isRequired
                        label="Aula"
                        placeholder="Selecciona un aula"
                        variant='bordered'
                        className="bg-transparent text-white rounded-md"
                        isDisabled={!isEditing}
                        name="classroom"
                        selectedKeys={formData.classroom ? new Set([formData.classroom.toString()]) : new Set()}
                        onSelectionChange={(keys) => handleInputChange({ target: { name: 'classroom', value: [...keys][0] } })}
                        errorMessage={errors.classroom}
                        isInvalid={!!errors.classroom}
                    >
                        {classrooms.map((classroom) => (
                            <SelectItem key={classroom.id} value={classroom.id.toString()}>
                                {classroom.name}
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