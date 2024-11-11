import { Button, Card, CardHeader, CardBody, CardFooter, Input, Select } from '@nextui-org/react';
import { useState } from 'react';

export default function GruposInterface() {
    const [codigo, setCodigo] = useState('');
    const [id, setId] = useState('');
    const [semestre, setSemestre] = useState('');
    const [alumnos, setAlumnos] = useState('');
    const [GroupName, setGrupo] = useState('');
    const [maestro, setMaestro] = useState('');
    const [salon, setSalon] = useState('');
    const [fecha, setFecha] = useState('');
    const [carrera, setCarrera] = useState('');
    const [materia, setMateria] = useState('');

    const handleInputChange = (setValue) => (e) => setValue(e.target.value);

    return (
        <div className="flex flex-col items-center min-h-screen min-w-full p-6 justify-center">
            <Card className="w-full max-w-3xl bg-[#0B0E23] bg-opacity-60 backdrop-filter backdrop-blur-lg p-6 rounded-lg">
                <CardHeader className="font-sans font-extrabold text-3xl text-center justify-center items-center">
                    Grupos
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

                <CardBody className="flex flex-wrap grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                        label="ID:" 
                        placeholder="content" 
                        variant='bordered'
                        value={id} 
                        onChange={handleInputChange(setId)} 
                        className="w-2/2"
                    />
                    <Select 
                        isRequired
                        label="MAESTRO:" 
                        placeholder="content"
                        variant='bordered'
                        value={maestro} 
                        onChange={(e) => setMaestro(e)}
                        className="w-2/2"
                    >

                    </Select>
                    <Input 
                        label="NOMBRE DE GRUPO:" 
                        placeholder="content"
                        variant='bordered' 
                        value={GroupName} 
                        onChange={handleInputChange(setGrupo)} 
                        className="w-2/2"
                    />
                    <Select 
                        isRequired
                        label="SALON:" 
                        placeholder="content"
                        variant='bordered'
                        value={salon} 
                        onChange={(e) => setSalon(e)}
                        className="w-2/2"
                    >
                    </Select>
                    <Input 
                        label="FECHA:" 
                        placeholder="content"
                        variant='bordered' 
                        value={fecha} 
                        onChange={handleInputChange(setFecha)} 
                        className="w-2/2"
                    />
                    <Select 
                        isRequired
                        label="SEMESTRE:" 
                        placeholder="content"
                        variant='bordered'
                        value={semestre} 
                        onChange={(e) => setSemestre(e)}
                        className="w-2/2"
                    >
                    </Select>
                    <Select 
                        isRequired
                        label="CARRERA:" 
                        placeholder="content"
                        variant='bordered'
                        value={carrera} 
                        onChange={(e) => setCarrera(e)}
                        className="w-2/2"
                    >
                    </Select>
                    <Select 
                        isRequired
                        label="MAX NUM DE ALUMNOS:" 
                        placeholder="content"
                        variant='bordered'
                        value={alumnos} 
                        onChange={(e) => setAlumnos(e)}
                        className="w-2/2"
                    >
                    </Select>
                    <Select 
                        isRequired
                        label="MATERIA:" 
                        placeholder="content"
                        variant='bordered'
                        value={materia} 
                        onChange={(e) => setMateria(e)}
                        className="w-2/2"
                    >
                    </Select>
                    
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
