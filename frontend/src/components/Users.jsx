import React, { useState, useEffect, useRef } from 'react';
import { Button, Select, Input, SelectItem, DateInput, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'; // Importa los componentes necesarios de NextUI
import { CalendarDate } from '@internationalized/date'; // Importa CalendarDate
import { roles, status } from '../data/data'; // Importa los roles predefinidos
import api from '../services/api'; // Importa el cliente HTTP

export default function Users() {
  // Arreglar esto más adelante:    vvvvv
  const [role, setRole] = useState('career_admin');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    father_last_name: '',
    mother_last_name: '',
    email: '',
    username: '',
    role: '',
    password: '',
    is_active: '',
    birthdate: new CalendarDate(2000, 1, 1), // Inicializa con una fecha válida
    career: '',
    studies_degree: ''
  });
  
  const [errors, setErrors] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const [popoverContent, setPopoverContent] = useState(''); // Estado para el contenido del popover
  const [showPopover, setShowPopover] = useState(false); // Estado para mostrar el popover
  const popoverRef = useRef(null); // Referencia al popover

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverRef]);

  // Función para convertir la fecha al formato DD-MM-YYYY
  const formatDate = (date) => {
    const day = date.day.toString().padStart(2, '0');
    const month = date.month.toString().padStart(2, '0');
    const year = date.year.toString();
    return `${day}-${month}-${year}`;
  };

  // Maneja el envío del formulario
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Obtener el role seleccionado
    const role = formData.role; // Asegúrate de que `selectedProfile` esté definido en tu is_active

    // Crear un objeto de datos basado en el role seleccionado
    let data = {
        name: formData.name,
        father_last_name: formData.father_last_name,
        mother_last_name: formData.mother_last_name,
        email: formData.email,
        role: formData.role,
        username: formData.username,
        password: formData.password,
    };

      if (role === 'teacher') {
        data = {
            ...data,
            career: formData.career,
            studies_degree: formData.studies_degree,
        };
    } else if (role === 'student') {
        data = {
            ...data,
            is_active: formData.is_active,
            birthdate: formatDate(formData.birthdate), // Convierte la fecha al formato requerido
            career: formData.career,
        };
    }

    try {
      const response = await api.post('/users/', data);
  
      if (response.status === 201) {
        setPopoverContent('Datos guardados correctamente');
        console.log('Datos enviados exitosamente:', response.data);
        handleCancel();
      }
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
      } else {
        console.error('Error al enviar los datos:', error);
        setErrors({ general: 'Error al enviar los datos' });
        setPopoverContent('Error al enviar los datos');

      }
    } finally {
      setLoading(false);
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 10000); // Oculta el popover después de 10 segundos
    }
  };

  // Maneja el cambio de rol
  const handleRoleChange = (value) => {
    setRole(value);
    setFormData({ ...formData, role: value });
    console.log('Role:', value);

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.role;
      if (role === 'student') {
        delete newErrors.is_active;
        delete newErrors.birthdate;
        delete newErrors.career;
      } else if (role === 'teacher') {
        delete newErrors.career;
        delete newErrors.studies_degree;
      }
      return newErrors;
    });
  };
  //Maneja el cambio de input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Elimina el error para el campo actual al modificarlo
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '' // Elimina el error para ese campo
    }));
  
    // Actualiza los datos del formulario
    setFormData({
      ...formData,
      [name]: value
    });
  };
  //Maneja el cambio de fecha
  const handleDateChange = (value) => {
    setFormData({ ...formData, birthdate: value });  // Actualiza el valor de birthdate en el formulario
  
    // Elimina el error relacionado con el campo 'birthdate' si existe
    setErrors((prevErrors) => {
      const { birthdate, ...rest } = prevErrors;  // Elimina el error de birthdate
      return rest;
    });
  };
  //Maneja el evento de nuevo
  const handleNew = () => {
    setIsEditing(true);
    setHasSearched(true);
  };

  const handleEdit = () => {
    setIsEditing(true); // Activa el estado de edición
  };


  //Maneja el evento de cancelar
  const handleCancel = () => {
    setIsEditing(false);
    setHasSearched(false);
    setFormData({
      id: '',
      name: '',
      father_last_name: '',
      mother_last_name: '',
      email: '',
      username: '',
      role: formData.role,
      password: '',
      is_active: '',
      birthdate: new CalendarDate(2000, 1, 1), // Restablece a una fecha válida
      career: '',
      studies_degree: ''
    });
  
    // Restablece los errores
    setErrors({});
  };

  // Maneja el evento de búsqueda
  const handleSearch = () => {
    setHasSearched(true); // Actualiza el estado de búsqueda
  };

  const handlePopoverChange = (isOpen) => {
    setShowPopover(isOpen);
    if (!isOpen) {
      setPopoverContent(''); // Limpia el contenido del popover cuando se cierra
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg">
      <h2 className="text-foreground font-sans font-extrabold text-3xl justify-center items-center text-center mb-6">Usuarios</h2>

      <div className="p-6 bg-transparent rounded-lg">
        {/* Buscar y Código de Usuario */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                placeholder="Ej. 12345"
                variant='bordered'
                label="Código de usuario"
                className="bg-transparent text-white"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-end space-x-2 pb-2">
              <Button color="primary" variant="flat" onClick={handleSearch} isDisabled={isEditing}>Buscar</Button>
              <Button color="secondary" variant="flat" isDisabled={!hasSearched || isEditing} onClick={handleEdit}>Editar</Button>
              <Button color="danger" variant="flat" isDisabled={!hasSearched || isEditing}>Baja</Button>
            </div>
          </div>
        </div>

        {/* Formulario de Información de Usuario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input isDisabled label="ID" placeholder="12345" variant="bordered" value={formData.id} />
          <Input isRequired label="Nombre" placeholder="Ej. Juan" variant="bordered" isDisabled={!isEditing} name="name" value={formData.name} onChange={handleInputChange} errorMessage={errors.name} isInvalid={!!errors.name} />
          <Input isRequired label="A paterno" placeholder="Ej. Perez" variant="bordered" isDisabled={!isEditing} name="father_last_name" value={formData.father_last_name} onChange={handleInputChange} errorMessage={errors.father_last_name} isInvalid={!!errors.father_last_name} />
          <Input isRequired label="A materno" placeholder="Ej. Robles" variant="bordered" isDisabled={!isEditing} name="mother_last_name" value={formData.mother_last_name} onChange={handleInputChange} errorMessage={errors.mother_last_name} isInvalid={!!errors.mother_last_name} />
          <Input isRequired label="Email" placeholder="juan.perez@example.com" type="email" variant="bordered" isDisabled={!isEditing} name="email" value={formData.email} onChange={handleInputChange} errorMessage={errors.email} isInvalid={!!errors.email} />
          <Input isRequired label="Nombre Usuario" placeholder="juanito" variant="bordered" isDisabled={!isEditing} name="username" value={formData.username} onChange={handleInputChange} errorMessage={errors.username} isInvalid={!!errors.username} />
          <Input isRequired label="Password" placeholder="••••••••" type="password" variant="bordered" isDisabled={!isEditing} name="password" value={formData.password} onChange={handleInputChange} errorMessage={errors.password} isInvalid={!!errors.password} />
          <Select
            label="Perfil"
            isRequired
            placeholder="Selecciona un Perfil"
            onChange={(e) => handleRoleChange(e.target.value)}
            variant="bordered"
            errorMessage="Selecciona un perfil valido"
            isInvalid={!!errors.role}
            className="bg-transparent text-white rounded-md"
            isDisabled={!isEditing}
            name="role"
            value={formData.role}
          >
            {roles.map((role) => (
              <SelectItem key={role.key} value={role.key}>
                {role.label}
              </SelectItem>
            ))}
          </Select>
          {role === 'student' && (
            <>
              <Select
                label="Estado"
                isRequired
                placeholder="Selecciona un Estado"
                onChange={(e) => handleInputChange({ target: { name: 'is_active', value: e.target.value } })}
                variant="bordered"
                errorMessage={errors.is_active}
                isInvalid={!!errors.is_active}
                className="bg-transparent text-white rounded-md"
                isDisabled={!isEditing}
                name="is_active"
                value={formData.is_active}
              >
                {status.map((status) => (
                  <SelectItem key={status.key} value={status.key}>
                    {status.label}
                  </SelectItem>
                ))}
              </Select>
              <DateInput isRequired label="Fecha de nacimiento" placeholderValue={new CalendarDate(2000, 1, 1)} variant="bordered" className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="birthdate" value={formData.birthdate} onChange={handleDateChange} errorMessage={errors.birthdate} isInvalid={!!errors.birthdate} />
              <Input isRequired label="Carrera" placeholder="Ej. Ing. Mecanica" variant="bordered" isDisabled={!isEditing} name="career" value={formData.career} onChange={handleInputChange} errorMessage={errors.career} isInvalid={!!errors.career} />
            </>
          )}
          {role === 'teacher' && (
            <>
              <Input isRequired label="Carrera" placeholder="Ej. Ing. Quimica" variant="bordered" isDisabled={!isEditing} name="career" value={formData.career} onChange={handleInputChange} errorMessage={errors.career} isInvalid={!!errors.career} />
              <Input isRequired label="Grado de estudios" placeholder="Ej. Doctorado" variant="bordered" isDisabled={!isEditing} name="studies_degree" value={formData.studies_degree} onChange={handleInputChange} errorMessage={errors.studies_degree} isInvalid={!!errors.studies_degree} />
            </>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-around mt-6">
        <Button color="success" variant="flat" onClick={handleNew} isDisabled={hasSearched}>Nuevo</Button>
        <Popover placement="bottom" showArrow={true} isOpen={showPopover} onOpenChange={handlePopoverChange}>
            <PopoverTrigger>
              <Button color="primary" variant="flat" isDisabled={!isEditing || loading || Object.values(errors).some(error => error)} onClick={handleSave} isLoading={loading}>Guardar</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                <div className="text-small font-bold">{popoverContent}</div>
              </div>
            </PopoverContent>
          </Popover>
          <Button color="default" variant="flat" isDisabled={!hasSearched} onClick={handleCancel}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}