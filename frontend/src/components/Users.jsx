import React, { useState } from 'react';
import { Button, Select, Input, SelectItem, DateInput } from '@nextui-org/react'; // Importa los componentes necesarios de NextUI
import { CalendarDate } from '@internationalized/date'; // Importa CalendarDate
import { roles } from '../data/roles'; // Importa los roles predefinidos

export default function Users() {
  const [role, setRole] = useState('admin');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    aPaterno: '',
    aMaterno: '',
    email: '',
    perfil: '',
    nombreUsuario: '',
    password: '',
    estado: '',
    fechaNacimiento: new CalendarDate(2000, 1, 1), // Inicializa con una fecha válida
    carrera: '',
    gradoEstudios: ''
  });

  const handleRoleChange = (value) => {
    setRole(value);
    setFormData({ ...formData, perfil: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (value) => {
    setFormData({ ...formData, fechaNacimiento: value }); // Asegúrate de que sea un valor compatible con DateInput
  };

  const handleNew = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      id: '',
      nombre: '',
      aPaterno: '',
      aMaterno: '',
      email: '',
      perfil: '',
      nombreUsuario: '',
      password: '',
      estado: '',
      fechaNacimiento: new CalendarDate(2000, 1, 1), // Restablece a una fecha válida
      carrera: '',
      gradoEstudios: ''
    });
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
              <Button color="primary" variant="flat">Buscar</Button>
              <Button color="secondary" variant="flat">Editar</Button>
              <Button color="danger" variant="flat">Baja</Button>
            </div>
          </div>
        </div>

        {/* Formulario de Información de Usuario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input isDisabled label="ID" placeholder="12345" variant="bordered" value={formData.id} />
          <Input isRequired label="Nombre" placeholder="Ej. Juan" variant="bordered" isDisabled={!isEditing} name="nombre" value={formData.nombre} onChange={handleInputChange} />
          <Input isRequired label="A paterno" placeholder="Ej. Perez" variant="bordered" isDisabled={!isEditing} name="aPaterno" value={formData.aPaterno} onChange={handleInputChange} />
          <Input isRequired label="A materno" placeholder="Ej. Robles" variant="bordered" isDisabled={!isEditing} name="aMaterno" value={formData.aMaterno} onChange={handleInputChange} />
          <Input isRequired label="Email" placeholder="juan.perez@example.com" type="email" variant="bordered" isDisabled={!isEditing} name="email" value={formData.email} onChange={handleInputChange} />
          <Select
            label="Perfil"
            isRequired
            placeholder="Selecciona un perfil"
            onChange={(e) => handleRoleChange(e.target.value)}
            variant="bordered"
            className="bg-transparent text-white rounded-md"
            isDisabled={!isEditing}
            name="perfil"
            value={formData.perfil}
          >
            {roles.map((role) => (
              <SelectItem key={role.key} value={role.key}>
                {role.label}
              </SelectItem>
            ))}
          </Select>
          {role === 'admin' && (
            <>
              <Input isRequired label="Nombre Usuario" placeholder="juanito" variant="bordered" isDisabled={!isEditing} name="nombreUsuario" value={formData.nombreUsuario} onChange={handleInputChange} />
              <Input isRequired label="Password" placeholder="••••••••" type="password" variant="bordered" isDisabled={!isEditing} name="password" value={formData.password} onChange={handleInputChange} />
            </>
          )}
          {role === 'alumno' && (
            <>
              <Input isRequired label="Estado" placeholder="Ej. Activo" variant="bordered" isDisabled={!isEditing} name="estado" value={formData.estado} onChange={handleInputChange} />
              <DateInput isRequired label="Fecha de nacimiento" placeholderValue={new CalendarDate(2000, 1, 1)} variant="bordered" className="bg-transparent text-white rounded-md" isDisabled={!isEditing} name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleDateChange} />
              <Input isRequired label="Carrera" placeholder="Ej. Ing. Mecanica" variant="bordered" isDisabled={!isEditing} name="carrera" value={formData.carrera} onChange={handleInputChange} />
            </>
          )}
          {role === 'maestro' && (
            <>
              <Input isRequired label="Carrera" placeholder="Ej. Ing. Quimica" variant="bordered" isDisabled={!isEditing} name="carrera" value={formData.carrera} onChange={handleInputChange} />
              <Input isRequired label="Grado de estudios" placeholder="Ej. Doctorado" variant="bordered" isDisabled={!isEditing} name="gradoEstudios" value={formData.gradoEstudios} onChange={handleInputChange} />
            </>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-around mt-6">
          <Button color="success" variant="flat" onClick={handleNew}>Nuevo</Button>
          <Button color="primary" variant="flat" isDisabled={!isEditing}>Guardar</Button>
          <Button color="default" variant="flat" isDisabled={!isEditing} onClick={handleCancel}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}