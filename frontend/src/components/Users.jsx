import React, { useState, useEffect, useRef } from 'react';
import { Button, Select, Input, SelectItem, DateInput, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'; // Importa los componentes necesarios de NextUI
import { CalendarDate } from '@internationalized/date'; // Importa CalendarDate
import { roles } from '../data/data'; // Importa los roles predefinidos
import api, { getCareers, getUserById, createUser, updateUser, deactivateUser } from '../services/api'; // Importa el cliente HTTP y la función getCarreras

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
    birthdate: new CalendarDate(2000, 1, 1), // Inicializa con una fecha válida
    career: '',
    studies_degree: ''
  });
  const [careers, setCareers] = useState([]); // Estado para las carreras
  const [errors, setErrors] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const [popoverContent, setPopoverContent] = useState(''); // Estado para el contenido del popover
  const [showPopover, setShowPopover] = useState(false); // Estado para mostrar el popover
  const [popoverTarget, setPopoverTarget] = useState(null); // Estado para el objetivo del popover
  const popoverRef = useRef(null); // Referencia al popover
  const [isNew, setIsNew] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [deactivateTimeout, setDeactivateTimeout] = useState(null);

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

  // Obtener las carreras al cargar el componente
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await getCareers();
        setCareers(data);
      } catch (error) {
        console.error('Error al obtener las carreras:', error);
      }
    };

    fetchCareers();
  }, []);

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
    const role = formData.role;
    // Crear un objeto de datos basado en el role seleccionado
    let data = {
        name: formData.name,
        father_last_name: formData.father_last_name,
        mother_last_name: formData.mother_last_name,
        email: formData.email,
        role: formData.role,
        username: formData.username,
    };

      if (!hasSearched){
        data={
          ...data,
          password: formData.password,
        }
      }

      if (role === 'teacher') {
        data = {
            ...data,
            career: formData.career,
            studies_degree: formData.studies_degree,
        };
    } else if (role === 'student') {
        data = {
            ...data,
            birthdate: formatDate(formData.birthdate), // Convierte la fecha al formato requerido
            career: formData.career,
        };
    }

    try {
      let response;
      if (hasSearched) {
        // Realizar PUT si hasSearched es true
        response = await updateUser(formData.id, data);
        if (response.status === 200) {
          setPopoverContent('Datos actualizados correctamente');
          setPopoverTarget('save');
          console.log('Datos actualizados exitosamente:', response.data);
          handleCancel();
        }
      } else {
        // Realizar POST si hasSearched es false
        response = await createUser(data);
        if (response.status === 201) {
          setPopoverContent('Datos guardados correctamente');
          setPopoverTarget('save');
          console.log('Datos enviados exitosamente:', response.data);
          handleCancel();
        }
      }
      console.log(response.status)
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

  const handleNew = () => {
    setIsEditing(true);
    setIsNew(true);
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
      father_last_name: '',
      mother_last_name: '',
      email: '',
      username: '',
      role: formData.role,
      password: '',
      is_active: '',
      birthdate: new CalendarDate(2000, 1, 1), 
      career: '',
      studies_degree: ''
    });
  
    // Restablece los errores
    setErrors({});
  };

  // Función para convertir una fecha en formato YYYY-MM-DD a un objeto CalendarDate
  const convertToCalendarDate = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('-').map(Number);
  return new CalendarDate(year, month, day);
};

  // Maneja el evento de búsqueda
  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getUserById(formData.id);
      const birthdate = convertToCalendarDate(data.birthdate);
      const career = careers.find(career => career.id === data.career);
      handleRoleChange(data.role || ''); // Llama a handleRoleChange con el rol recibido
      console.log(data);
      setFormData({
        ...formData,
        name: data.name || '',
        father_last_name: data.father_last_name || '',
        mother_last_name: data.mother_last_name || '',
        email: data.email || '',
        username: data.username || '',
        role: data.role || '',
        password: '', // No se debe rellenar el campo de contraseña
        birthdate: birthdate,
        career: career ? career.id.toString() : '', 
        studies_degree: data.studies_degree || ''
      });
      setIsEditing(false);
      setHasSearched(true);
      setPopoverTarget('search');
      setPopoverContent('Búsqueda realizada correctamente');
      setShowPopover(true); // Muestra el popover
      setTimeout(() => setShowPopover(false), 10000);
    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      setPopoverContent('Error al buscar el usuario');
      setPopoverTarget('search');
      setShowPopover(true); // Muestra el popover
      setTimeout(() => setShowPopover(false), 10000);
  } finally{
    setLoading(false);
  }
};

  // Función para desactivar un usuario
  const handleDeactivate = async () => {
  if (!confirmDeactivate) {
    setPopoverContent('¿Estás seguro de querer desactivar este usuario? Esto podría tener repercusiones en su agenda de materias y carrera. Si estás seguro, pulsa el botón otra vez.');
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

  // Si se confirma la desactivación, proceder con la desactivación del usuario
  setLoading(true);
  try {
    await deactivateUser(formData.id);
    setPopoverContent('Usuario desactivado correctamente');
    setPopoverTarget('deactivate');
    handleCancel();
    setShowPopover(true);
    setTimeout(() => setShowPopover(false), 10000);
  } catch (error) {
    console.error('Error al desactivar el usuario:', error);
    setPopoverContent('Error al desactivar el usuario');
    setPopoverTarget('deactivate');
    setShowPopover(true);
    setTimeout(() => setShowPopover(false), 10000);
  } finally {
    setLoading(false);
    setConfirmDeactivate(false);
    clearTimeout(deactivateTimeout);
  }
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
            <Popover placement="bottom" showArrow={true} isOpen={showPopover && popoverTarget === 'search'} onOpenChange={handlePopoverChange}>
                <PopoverTrigger>
                  <Button color="primary" variant="flat" onClick={handleSearch} isDisabled={isEditing || hasSearched}>Buscar</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">{popoverContent}</div>
                  </div>
                </PopoverContent>
                </Popover>
                <Button color="secondary" variant="flat" isDisabled={!hasSearched || isEditing} onClick={handleEdit}>Editar</Button>
                <Popover placement="bottom" showArrow={true} isOpen={showPopover && popoverTarget === 'deactivate'} onOpenChange={handlePopoverChange}>
                    <PopoverTrigger>
                      <Button color="danger" variant="flat" isDisabled={!hasSearched || isEditing} onClick={handleDeactivate}>Baja</Button>
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

        {/* Formulario de Información de Usuario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input isDisabled label="ID" placeholder="12345" variant="bordered" value={formData.id} />
          <Input isRequired label="Nombre" placeholder="Ej. Juan" variant="bordered" isDisabled={!isEditing} name="name" value={formData.name} onChange={handleInputChange} errorMessage={errors.name} isInvalid={!!errors.name} />
          <Input isRequired label="A paterno" placeholder="Ej. Perez" variant="bordered" isDisabled={!isEditing} name="father_last_name" value={formData.father_last_name} onChange={handleInputChange} errorMessage={errors.father_last_name} isInvalid={!!errors.father_last_name} />
          <Input isRequired label="A materno" placeholder="Ej. Robles" variant="bordered" isDisabled={!isEditing} name="mother_last_name" value={formData.mother_last_name} onChange={handleInputChange} errorMessage={errors.mother_last_name} isInvalid={!!errors.mother_last_name} />
          <Input isRequired label="Email" placeholder="juan.perez@example.com" type="email" variant="bordered" isDisabled={!isEditing} name="email" value={formData.email} onChange={handleInputChange} errorMessage={errors.email} isInvalid={!!errors.email} />
          <Input isRequired label="Nombre Usuario" placeholder="juanito" variant="bordered" isDisabled={!isEditing} name="username" value={formData.username} onChange={handleInputChange} errorMessage={errors.username} isInvalid={!!errors.username} />
          <Input isRequired = {!hasSearched} label="Password" placeholder="••••••••" type="password" variant="bordered" isDisabled={!isEditing} name="password" value={formData.password} onChange={handleInputChange} errorMessage={errors.password} isInvalid={!!errors.password} />
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
            selectedKeys={new Set([formData.role])} // Selecciona la key del rol recibido desde el backend
          >
            {roles.map((role) => (
              <SelectItem key={role.key} value={role.key}>
                {role.label}
              </SelectItem>
            ))}
          </Select>
          {role === 'student' && (
            <>
              <DateInput isRequired label="Fecha de nacimiento" placeholderValue={new CalendarDate(2000, 1, 1)} variant="bordered" className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="birthdate" value={formData.birthdate} onChange={handleDateChange} errorMessage={errors.birthdate} isInvalid={!!errors.birthdate} />
              <Select
                label="Carrera"
                isRequired
                placeholder="Selecciona una Carrera"
                onChange={(e) => handleInputChange({ target: { name: 'career', value: e.target.value } })}
                variant="bordered"
                errorMessage={errors.career}
                isInvalid={!!errors.career}
                className="bg-transparent text-white rounded-md"
                isDisabled={!isEditing}
                name="career"
                selectedKeys={new Set([formData.career])} // Selecciona la key de la carrera recibida desde el backend
              >
                {careers.map((career) => (
                  <SelectItem key={career.id} value={career.id}>
                    {career.name}
                  </SelectItem>
                ))}
              </Select>               </>
          )}
          {role === 'teacher' && (
            <>
              <Select
                label="Carrera"
                isRequired
                placeholder="Selecciona una Carrera"
                onChange={(e) => handleInputChange({ target: { name: 'career', value: e.target.value } })}
                variant="bordered"
                errorMessage={errors.career}
                isInvalid={!!errors.career}
                className="bg-transparent text-white rounded-md"
                isDisabled={!isEditing}
                name="career"
                selectedKeys={new Set([formData.career])} // Selecciona la key de la carrera recibida desde el backend

              >
                {careers.map((career) => (
                  <SelectItem key={career.id} value={career.id}>
                    {career.name}
                  </SelectItem>
                ))}
              </Select>              
              <Input isRequired label="Grado de estudios" placeholder="Ej. Doctorado" variant="bordered" isDisabled={!isEditing} name="studies_degree" value={formData.studies_degree} onChange={handleInputChange} errorMessage={errors.studies_degree} isInvalid={!!errors.studies_degree} />
            </>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-around mt-6">
        <Button color="success" variant="flat" onClick={handleNew} isDisabled={isNew || hasSearched}>Nuevo</Button>
        <Popover placement="bottom" showArrow={true} isOpen={showPopover && popoverTarget === 'save'} onOpenChange={handlePopoverChange}>
            <PopoverTrigger>
              <Button color="primary" variant="flat" isDisabled={!isEditing || loading || Object.values(errors).some(error => error)} onClick={handleSave} isLoading={loading}>Guardar</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                <div className="text-small font-bold">{popoverContent}</div>
              </div>
            </PopoverContent>
          </Popover>
          <Button color="default" variant="flat" isDisabled={!isNew && !hasSearched} onClick={handleCancel}>Cancelar</Button>
          </div>
      </div>
    </div>
  );
}