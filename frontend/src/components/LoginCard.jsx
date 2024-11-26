import { Button, Card, CardHeader, CardBody, CardFooter, Avatar, Input } from '@nextui-org/react'; 
import { useState } from 'react';
import { MdLockOutline, MdOutlinePerson } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import api from '../services/api'; // Importa el cliente HTTP
import { useNavigate } from 'react-router-dom';

export default function LoginCard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ username: false, password: false });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function validateUsername(username) {
        return username.length >= 4;
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    const handleChange = (label, value) => {
        if (label === "username") {
            setUsername(value);
            setError({ ...error, username: !validateUsername(value) });
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
                username: username,
                password: password,
            });

            if (response.status === 200) {
                const { access, refresh, user } = response.data;
                const now = new Date();
                const tokenExpirationDate = new Date(now.getTime() + 5 * 60 * 1000); // Asumiendo que el token expira en 5 minutos

                // Guardar el token, el rol y la fecha de expiración en localStorage
                localStorage.setItem('authToken', access);
                localStorage.setItem('refreshToken', refresh);
                localStorage.setItem('tokenExpiration', tokenExpirationDate.toISOString());
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userId', user.id);

                // Redirigir al dashboard
                navigate('/dashboard');
                console.log(response.data);
            } else {
                setError({ username: true, password: true });
            }
        } catch (err) {
            setError({ username: true, password: true });
        } finally {
            setLoading(false);
        }
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
                    <Input 
                        placeholder="Juan"
                        variant='bordered'
                        label="Nombre de usuario" 
                        startContent={<MdOutlinePerson className='text-xl' />}
                        isInvalid={error.username} 
                        errorMessage="No has escrito un correo bien mamawebo"
                        onChange={(event) => handleChange('username', event.target.value)} 
                    />
                    <Input 
                        placeholder="••••••••" 
                        variant='bordered'
                        label="Contraseña"
                        startContent={<MdLockOutline className='text-xl' />}
                        type="password" 
                        isInvalid={error.password} 
                        errorMessage="No has escrito una contraseña bien mamawebo"
                        onChange={(event) => handleChange('password', event.target.value)} 
                    />
                </CardBody>
                <CardFooter className='flex justify-end'>
                    <Button color='primary' variant='flat' onClick={handleSubmit} isLoading={loading} disabled={loading || error.username || error.password}>
                        Iniciar sesión
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}