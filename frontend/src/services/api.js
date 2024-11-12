import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // URL de tu backend Django
});

// Interceptor para incluir el token en cada request
api.interceptors.request.use(async config => {
    let token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token) {
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        const now = new Date();

        // Verificar si el token ha expirado
        if (tokenExpiration && new Date(tokenExpiration) < now) {
            // Intentar renovar el token
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: refreshToken
                });
                token = response.data.access;
                localStorage.setItem('authToken', token);
                localStorage.setItem('tokenExpiration', new Date(now.getTime() + 5 * 60 * 1000)); // Asumiendo que el token expira en 5 minutos
            } catch (error) {
                console.error('Error al renovar el token', error);
                // Redirigir al usuario a la página de inicio de sesión si la renovación falla
                window.location.href = '/login';
            }
        }

        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;