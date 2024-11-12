import { Button, Select, SelectItem, DateInput } from '@nextui-org/react';
import StyledInput from './StyledInput'; // Importa el componente de input reutilizable

export default function Groups() {
    return (
        <div className="p-6 max-w-4xl mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg">
            <h2 className="text-foreground font-sans font-extrabold text-3xl justify-center items-center text-center mb-6">Grupos</h2>

            <div className="p-6 bg-transparent rounded-lg">
                {/* Buscar y Código de Grupo */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <StyledInput
                                placeholder="Ej. 12345"
                                label="Código de grupo"
                                className="bg-transparent text-white"
                            />
                        </div>
                        <div className="flex items-end space-x-2 pb-2">
                            <Button color="primary" variant='flat'>Buscar</Button>
                            <Button color="secondary" variant='flat'>Editar</Button>
                            <Button color="danger" variant='flat'>Baja</Button>
                        </div>
                    </div>
                </div>

                {/* Formulario de Información de Grupo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StyledInput label="ID" placeholder="12345" className="bg-[#1b263b] text-white" />
                    <Select label="Maestro" placeholder="Selecciona un maestro" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <StyledInput label="Nombre de Grupo" placeholder="Ej. Grupo A" className="bg-[#1b263b] text-white" />
                    <Select label="Salón" placeholder="Selecciona un salón" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <DateInput label="Fecha" placeholder="dd/mm/yyyy" variant="bordered" className="bg-transparent text-white rounded-md" />
                    <Select label="Semestre" placeholder="Selecciona un semestre" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <Select label="Carrera" placeholder="Selecciona una carrera" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <Select label="Max Num de Alumnos" placeholder="Selecciona el máximo número de alumnos" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <Select label="Materia" placeholder="Selecciona una materia" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-around mt-6">
                    <Button color="success" variant='flat'>Nuevo</Button>
                    <Button color="primary" variant='flat'>Guardar</Button>
                    <Button color="default" variant='flat'>Cancelar</Button>
                </div>
            </div>
        </div>
    );
}