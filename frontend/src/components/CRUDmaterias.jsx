import { Button, Card, CardHeader, CardBody, CardFooter, Input, Select } from '@nextui-org/react';
import { useState } from 'react';

export default function MateriasInterface() {
    const [codigo, setCodigo] = useState('');
    const [id, setId] = useState('');
    const [asignatura, setAsignatura] = useState('');
    const [creditos, setCreditos] = useState('');
    const [semestre, setSemestre] = useState('');
    const [carrera, setCarrera] = useState('');

    const handleInputChange = (setValue) => (e) => setValue(e.target.value);

    return (
        <div className="flex flex-col items-center min-h-screen min-w-full p-6 justify-center">
            <Card className="w-full max-w-3xl bg-[#0B0E23] bg-opacity-60 backdrop-filter backdrop-blur-lg p-6 rounded-lg">
                <CardHeader className="font-sans font-extrabold text-3xl text-center justify-center items-center">
                    Materias
                </CardHeader>
                
                <div className="flex flex-wrap gap-4 my-4">
                    <Input
                        className="w-1/2"
                        placeholder="Ingrese código de materia"
                        variant='bordered'
                        value={codigo}
                        onChange={handleInputChange(setCodigo)}
                    />
                    <Button color="primary" variant='flat'>Buscar</Button>
                    <Button color="secondary" variant='flat'>Editar</Button>
                    <Button color="danger" variant='flat'>Baja</Button>
                </div>

                <CardBody className="flex flex-wrap gap-4">
                    <Input 
                        label="ID:" 
                        placeholder="content" 
                        variant='bordered'
                        value={id} 
                        onChange={handleInputChange(setId)} 
                        className="w-1/2"
                    />
                    <Select 
                        isRequired
                        label="CARRERA:" 
                        placeholder="content"
                        variant='bordered'
                        value={carrera} 
                        onChange={(e) => setCarrera(e)}
                        className="w-1/2"
                    >

                    </Select>
                    <Input 
                        label="ASIGNATURA:" 
                        placeholder="content"
                        variant='bordered' 
                        value={asignatura} 
                        onChange={handleInputChange(setAsignatura)} 
                        className="w-1/2"
                    />
                    <Input 
                        label="CREDITOS:" 
                        placeholder="content"
                        variant='bordered' 
                        value={creditos} 
                        onChange={handleInputChange(setCreditos)} 
                        className="w-1/2"
                    />
                    <Input 
                        label="SEMESTRE:" 
                        placeholder="content"
                        variant='bordered' 
                        value={semestre} 
                        onChange={handleInputChange(setSemestre)} 
                        className="w-1/2"
                    />
                </CardBody>

                <CardFooter className="flex justify-between">
                    <Button color="success" variant='flat' >Nuevo</Button>
                    <Button color="primary" variant='flat' >Guardar</Button>
                    <Button color="default" variant='flat' >Cancelar</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
