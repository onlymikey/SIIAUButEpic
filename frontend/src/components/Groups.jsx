import { Button, Select, SelectItem } from '@nextui-org/react';
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
                                placeholder="Ingrese código de grupo"
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
                    <StyledInput label="ID" placeholder="ID" className="bg-[#1b263b] text-white" />
                    <Select label="Maestro" placeholder="Maestro" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <StyledInput label="Nombre de Grupo" placeholder="Nombre de Grupo" className="bg-[#1b263b] text-white" />
                    <Select label="Salón" placeholder="Salón" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <StyledInput label="Fecha" placeholder="Fecha" className="bg-[#1b263b] text-white" />
                    <Select label="Semestre" placeholder="Semestre" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <Select label="Carrera" placeholder="Carrera" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <Select label="Max Num de Alumnos" placeholder="Max Num de Alumnos" variant='bordered' className="bg-transparent text-white rounded-md">
                        {/* Agrega las opciones aquí */}
                    </Select>
                    <Select label="Materia" placeholder="Materia" variant='bordered' className="bg-transparent text-white rounded-md">
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