import React, { useState, useEffect } from 'react';
import { Button, Select, Input, SelectItem, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import api, { getCareers, getSubjectById, createSubject, updateSubject, deleteSubject } from '../services/api';

export default function MateriasInterface() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    credits: '',
    semester: '',
    career: ''
  });
  const [careers, setCareers] = useState([]);
  const [errors, setErrors] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const [popoverContent, setPopoverContent] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [deactivateTimeout, setDeactivateTimeout] = useState(null);

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
      const data = await getSubjectById(formData.id);
      setFormData({
        ...formData,
        name: data.name || '',
        credits: data.credits || '',
        semester: data.semester || '',
        career: data.career ? data.career.toString() : ''
      });
      setIsEditing(false);
      setHasSearched(true);
      setPopoverTarget('search');
      setPopoverContent('Búsqueda realizada correctamente');
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 10000);
    } catch (error) {
      console.error('Error al buscar la materia:', error);
      setPopoverContent('Error al buscar la materia');
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
      credits: formData.credits,
      semester: formData.semester,
      career: formData.career
    };

    try {
      let response;
      if (hasSearched) {
        response = await updateSubject(formData.id, data);
        if (response.status === 200) {
          setPopoverContent('Datos actualizados correctamente');
          setPopoverTarget('save');
          console.log('Datos actualizados exitosamente:', response.data);
          handleCancel();
        }
      } else {
        response = await createSubject(data);
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
      setPopoverContent('¿Estás seguro de querer eliminar esta materia? Si estás seguro, pulsa el botón otra vez.');
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
  
    // Si se confirma la eliminación, proceder con la eliminación de la materia
    setLoading(true);
    try {
      await deleteSubject(formData.id);
      setPopoverContent('Materia eliminada correctamente');
      setPopoverTarget('deactivate');
      handleCancel();
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 10000);
    } catch (error) {
      console.error('Error al eliminar la materia:', error);
      setPopoverContent('Error al eliminar la materia');
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
      credits: '',
      semester: '',
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
      credits: '',
      semester: '',
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
      <h2 className="text-foreground font-sans font-extrabold text-3xl justify-center items-center text-center mb-6">Materias</h2>

      <div className="p-6 bg-transparent rounded-lg">
        {/* Buscar y Código de Materia */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                placeholder="Ej. 12345"
                label="Código de materia"
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

        {/* Formulario de Información de Materia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input isDisabled label="ID" placeholder="12345" variant="bordered" value={formData.id} />
          <Input isRequired label="Asignatura" placeholder="Ej. Matemáticas" variant="bordered" isDisabled={!isEditing} name="name" value={formData.name} onChange={handleInputChange} errorMessage={errors.name} isInvalid={!!errors.name} />
          <Input isRequired label="Créditos" placeholder="Ej. 4" variant="bordered" isDisabled={!isEditing} name="credits" value={formData.credits} onChange={handleInputChange} errorMessage={errors.credits} isInvalid={!!errors.credits} />
          <Input isRequired label="Semestre" placeholder="Ej. 1" variant="bordered" isDisabled={!isEditing} name="semester" value={formData.semester} onChange={handleInputChange} errorMessage={errors.semester} isInvalid={!!errors.semester} />
          <Select
            label="Carrera"
            isRequired
            placeholder="Selecciona una carrera"
            variant='bordered'
            className="bg-transparent text-white rounded-md"
            isDisabled={!isEditing}
            name="career"
            selectedKeys={new Set([formData.career])}
            onChange={(e) => handleInputChange({ target: { name: 'career', value: e.target.value } })}
          >
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