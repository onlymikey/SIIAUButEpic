import {Button, Card, CardHeader, CardBody, CardFooter, Input, Avatar} from '@nextui-org/react'; 
import { useState } from 'react';
import { MdLockOutline, MdOutlineMail } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";

export default function LoginCard(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({email: false, password: false})
    const [loading, setLoading] = useState(false);

    function validateEmail(email){
        return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null;
    }

    function validatePassword(password){
        return password.length >= 6;
    }

    const handleChange = (label, value) => {
        if (label === "email"){
            setEmail(value);
            setError({...error, email: !validateEmail(value)});
        }
        if (label === "password"){
            setPassword(value);
            setError({...error, password: !validatePassword(value)});
        }
    }

    const handleLogin = () => {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            setError({
                email: !isEmailValid,
                password: !isPasswordValid
            });
            return;
        }

        setLoading(true);
        // Simular una llamada al backend con un retraso de 5 segundos
        setTimeout(() => {
            setLoading(false);
            // Aquí puedes manejar la respuesta del backend
        }, 5000);
    }

    return (
        <div className="flex flex-col items-center min-h-screen min-w-full justify-center">
            <Avatar 
                icon={<BsFillPersonFill className="text-5xl" />} // Usa un icono de usuario genérico
                size="lg" 
                className="mb-6"
            />
        <Card className='w-full max-w-lg p-6 bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg' >
            <CardHeader className='text-foreground font-sans font-extrabold text-3xl justify-center items-center'>Iniciar sesión</CardHeader>
            <CardBody className='gap-3 flex flex-col'>
            <Input 
                    placeholder="example@gmail.com" 
                    label="Correo electrónico" 
                    startContent={<MdOutlineMail className='text-xl' />}
                    variant='bordered' 
                    onChange={(event) => handleChange('email', event.target.value)} 
                    isInvalid={error.email} 
                    errorMessage="No has escrito un correo bien mamawebo"
                />
                <Input 
                    placeholder="••••••••" 
                    label="Contraseña"
                    startContent={<MdLockOutline className='text-xl' />}
                    type="password" 
                    variant='bordered' 
                    onChange={(event) => handleChange('password', event.target.value)} 
                    isInvalid={error.password} 
                    errorMessage="No has escrito una contraseña bien mamawebo"
                />
            </CardBody>
            <CardFooter className='flex justify-end'>
            <Button color='primary' variant='flat' onClick={handleLogin} isLoading={loading} disabled={loading || error.email || error.password}>
                    Iniciar sesión
                </Button>
            </CardFooter>
        </Card>
        </div>
    )
}