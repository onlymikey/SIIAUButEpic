import React, { useState } from 'react';
import { Button, Select, SelectItem, DateInput } from '@nextui-org/react'; // Importa los componentes necesarios de NextUI
import StyledInput from './StyledInput'; // Importa el componente de input reutilizable
import { roles } from '../data/roles'; // Importa los roles predefinidos

export default function Users() {
  const [role, setRole] = useState('admin');

  const handleRoleChange = (value) => {
    setRole(value);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg">
      <h2 className="text-foreground font-sans font-extrabold text-3xl justify-center items-center text-center mb-6">Usuarios</h2>

      <div className="p-6 bg-transparent rounded-lg">
        {/* Buscar y Código de Usuario */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-2">
              <StyledInput
                placeholder="Ej. 12345"
                label="Código de usuario"
                className="bg-transparent text-white" // Mantén el fondo transparente y el texto blanco
              />
            </div>
            <div className="flex items-end space-x-2 pb-2"> {/* Asegurar que los botones estén alineados */}
              <Button color="primary" variant="flat">Buscar</Button>
              <Button color="secondary" variant="flat">Editar</Button>
              <Button color="danger" variant="flat">Baja</Button>
            </div>
          </div>
        </div>

        {/* Formulario de Información de Usuario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StyledInput label="ID" placeholder="12345" className="bg-[#1b263b] text-white" />
          <StyledInput label="Nombre" placeholder="Ej. Juan" className="bg-[#1b263b] text-white" />
          <StyledInput label="A paterno" placeholder="Ej. Perez" className="bg-[#1b263b] text-white" />
          <StyledInput label="A materno" placeholder="Ej. Robles" className="bg-[#1b263b] text-white" />
          <StyledInput label="Email" placeholder="juan.perez@example.com" type="email" className="bg-[#1b263b] text-white" />
          <Select
            label="Perfil"
            isRequired
            placeholder="Selecciona un perfil"
            onChange={(e) => handleRoleChange(e.target.value)}
            variant="bordered"
            className="bg-transparent text-white rounded-md"
          >
            {roles.map((role) => (
              <SelectItem key={role.key} value={role.key}>
                {role.label}
              </SelectItem>
            ))}
          </Select>
          {role === 'admin' && (
            <>
              <StyledInput label="Nombre Usuario" placeholder="juanito" className="bg-[#1b263b] text-white" />
              <StyledInput label="Password" placeholder="••••••••" type="password" className="bg-[#1b263b] text-white" />
            </>
          )}
          {role === 'alumno' && (
            <>
              <StyledInput label="Estado" placeholder="Ej. Activo" className="bg-[#1b263b] text-white" />
              <DateInput label="Fecha de nacimiento" placeholder="dd/mm/yyyy" variant="bordered" className="bg-transparent text-white rounded-md" />
              <StyledInput label="Carrera" placeholder="Ej. Ing. Mecanica" className="bg-[#1b263b] text-white" />
            </>
          )}
          {role === 'maestro' && (
            <>
              <StyledInput label="Carrera" placeholder="Ej. Ing. Quimica" className="bg-[#1b263b] text-white" />
              <StyledInput label="Grado de estudios" placeholder="Ej. Doctorado" className="bg-[#1b263b] text-white" />
            </>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-around mt-6">
          <Button color="success" variant="flat">Nuevo</Button>
          <Button color="primary" variant="flat">Guardar</Button>
          <Button color="default" variant="flat">Cancelar</Button>
        </div>
      </div>
    </div>
  );
};