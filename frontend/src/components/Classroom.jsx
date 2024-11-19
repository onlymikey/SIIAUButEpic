import { Input, Button } from '@nextui-org/react';

export default function Classroom() {
    return (
        <div className="p-6 max-w-4xl mx-auto bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg">
            <h2 className="text-foreground font-sans font-extrabold text-3xl justify-center items-center text-center mb-6">Aulas</h2>

            <div className="p-6 bg-transparent rounded-lg">
                {/* Buscar y Código de Aula */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <Input
                                placeholder="Ej. 12345"
                                label="Código del Aula"
                                variant='bordered'
                            />
                        </div>
                        <div className="flex items-end space-x-2 pb-2">
                            <Button color="primary" variant='flat'>Buscar</Button>
                            <Button color="secondary" variant='flat'>Editar</Button>
                            <Button color="danger" variant='flat'>Baja</Button>
                        </div>
                    </div>
                </div>

                {/* Formulario de Información de Carrera */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input isDisabled label="ID" placeholder="12345" variant="bordered" />
                    <Input isRequired label="Nombre del Aula" placeholder="Ej. A01E" variant="bordered" />
                    <Input isRequired label="Piso del Aula" placeholder="Ej. 1" variant="bordered" />
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