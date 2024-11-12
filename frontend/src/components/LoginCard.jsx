import { Button, Card, CardHeader, CardBody, CardFooter, Avatar } from '@nextui-org/react'; 
import { useState } from 'react';
import { MdLockOutline, MdOutlineMail } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import StyledInput from './StyledInput'; // Importa el componente de input reutilizable
import api from '../services/api'; // Importa el cliente HTTP
import { useNavigate } from 'react-router-dom';

export default function LoginCard() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ email: false, password: false });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function validateEmail(email) {
        return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null;
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    const handleChange = (label, value) => {
        if (label === "email") {
            setEmail(value);
            setError({ ...error, email: !validateEmail(value) });
        }
        if (label === "password") {
            setPassword(value);
            setError({ ...error, password: !validatePassword(value) });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/login/', {
                email: email,
                password: password,
            });

            if (response.data.status === 'success') {
                // Guardar el token y el rol en localStorage
                localStorage.setItem('authToken', response.data.access_token);
                localStorage.setItem('userRole', response.data.role);

                // Obtener los datos del usuario autenticado
                const userResponse = await api.get('/me', {
                    headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                    },
                });

                // Actualizar el contexto con los datos del usuario
                setUser(userResponse.data);

                // Redirigir al dashboard
                navigate('/dashboard');
            } else {
                setError({ email: true, password: true });
            }
        } catch (err) {
            setError({ email: true, password: true });
        } finally {
            setLoading(false);
        }
    };

    const handleDebugLogin = () => {
        localStorage.setItem('authToken', 'debug-token');
        localStorage.setItem('userRole', 'admin');
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col items-center min-h-screen min-w-full justify-center">
            <Avatar 
                icon={<BsFillPersonFill className="text-5xl" />} // Usa un icono de usuario genérico
                size="lg" 
                className="mb-6"
            />
            <Card className='w-full max-w-lg p-6 bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg'>
                <CardHeader className='text-foreground font-sans font-extrabold text-3xl justify-center items-center'>
                    Iniciar sesión
                </CardHeader>
                <CardBody className='gap-3 flex flex-col'>
                    <StyledInput 
                        placeholder="example@gmail.com" 
                        label="Correo electrónico" 
                        startContent={<MdOutlineMail className='text-xl' />}
                        isInvalid={error.email} 
                        errorMessage="No has escrito un correo bien mamawebo"
                        onChange={(event) => handleChange('email', event.target.value)} 
                    />
                    <StyledInput 
                        placeholder="••••••••" 
                        label="Contraseña"
                        startContent={<MdLockOutline className='text-xl' />}
                        type="password" 
                        isInvalid={error.password} 
                        errorMessage="No has escrito una contraseña bien mamawebo"
                        onChange={(event) => handleChange('password', event.target.value)} 
                    />
                </CardBody>
                <CardFooter className='flex justify-end'>
                    <Button color='primary' variant='flat' onClick={handleSubmit} isLoading={loading} disabled={loading || error.email || error.password}>
                        Iniciar sesión
                    </Button>
                    <Button color='secondary' variant='flat' onClick={handleDebugLogin}>
                    Debug Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}