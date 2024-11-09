import {Button, Card, CardHeader, CardBody, CardFooter, Input, circularProgress} from '@nextui-org/react'; 
import { useState } from 'react';

export default function LoginCard(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({email: false, password: false})

    function isLoading(){
        return (
            <circularProgress aria-label = "Cargando"/>
        )
    }

    function validateEmail(email){
        return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null;
    }

    function validatePassword(password){
        return password.length >= 6;
    }

    const handleBlur = (label) => {
        if (label == "email"){
            setError({...error, email: !validateEmail(email)})
        }
        if (label == "password"){
            setError({...error, password: !validatePassword(password)})
        }
    }
    return (
        <Card className='w-1/4'>
            <CardHeader className='text-foreground font-sans font-extrabold text-3xl justify-center items-center'>Iniciar sesión</CardHeader>
            <CardBody className='gap-3 '>
                <Input placeholder="example@gmail.com" label="Correo electrónico" variant='bordered' onChange={(event) => setEmail(event.target.value)} onBlur={() => handleBlur('email')} isInvalid={error.email} errorMessage="No has escrito un correo bien mamawebo"/>
                <Input placeholder="********" label="Contraseña" type="password" variant='bordered' onChange={(event) => setPassword(event.target.value)} onBlur={() => handleBlur('password')} isInvalid={error.password} errorMessage="No has escrito una contraseña bien mamawebo"/>
            </CardBody>
            <CardFooter className='flex justify-end'>
                <Button color='primary' variant='flat'>Iniciar sesión</Button>
            </CardFooter>
        </Card>
    )
}