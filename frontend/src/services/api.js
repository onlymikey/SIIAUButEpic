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

export const getUserGroups = async (userId) => {
    try {
        const response = await api.get(`/enrollments/user/${userId}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los grupos del usuario:', error);
        throw error;
    }
};

export const getCareers = async () => {
    try {
      const response = await api.get('/careers/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las carreras:', error);
      throw error;
    }
  };

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/users/', userData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}/`, userData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
};

// Función para desactivar un usuario
export const deactivateUser = async (id) => {
    try {
        const response = await api.patch(`/users/${id}/deactivate/`);
        return response.data;
    } catch (error) {
        console.error('Error al desactivar el usuario:', error);
        throw error;
    }
};

// Funciones para manejar las materias (subjects)
export const getSubjects = async () => {
    try {
        const response = await api.get('/subjects/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las materias:', error);
        throw error;
    }
};


export const getSubjectById = async (id) => {
    try {
        const response = await api.get(`/subjects/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la materia:', error);
        throw error;
    }
};

export const createSubject = async (subjectData) => {
    try {
        const response = await api.post('/subjects/', subjectData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al crear la materia:', error);
        throw error;
    }
};

export const updateSubject = async (id, subjectData) => {
    try {
        const response = await api.put(`/subjects/${id}/`, subjectData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        throw error;
    }
};

export const deleteSubject = async (id) => {
    try {
        const response = await api.delete(`/subjects/${id}/`);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al eliminar la materia:', error);
        throw error;
    }
};

// Funciones para manejar las aulas (classrooms)
export const getClassrooms = async () => {
    try {
        const response = await api.get('/classrooms/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las aulas:', error);
        throw error;
    }
};

export const getClassroomById = async (id) => {
    try {
        const response = await api.get(`/classrooms/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el aula:', error);
        throw error;
    }
};

export const createClassroom = async (classroomData) => {
    try {
        const response = await api.post('/classrooms/', classroomData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al crear el aula:', error);
        throw error;
    }
};

export const updateClassroom = async (id, classroomData) => {
    try {
        const response = await api.put(`/classrooms/${id}/`, classroomData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al actualizar el aula:', error);
        throw error;
    }
};

export const deleteClassroom = async (id) => {
    try {
        const response = await api.delete(`/classrooms/${id}/`);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al eliminar el aula:', error);
        throw error;
    }
};

// Funciones para manejar las carreras (careers)
export const getCareerById = async (id) => {
    try {
        const response = await api.get(`/careers/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la carrera:', error);
        throw error;
    }
};

export const createCareer = async (careerData) => {
    try {
        const response = await api.post('/careers/', careerData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al crear la carrera:', error);
        throw error;
    }
};

export const updateCareer = async (id, careerData) => {
    try {
        const response = await api.put(`/careers/${id}/`, careerData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al actualizar la carrera:', error);
        throw error;
    }
};

export const deleteCareer = async (id) => {
    try {
        const response = await api.delete(`/careers/${id}/`);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al eliminar la carrera:', error);
        throw error;
    }
};

// Funciones para manejar los grupos (groups)
export const getGroupById = async (id) => {
    try {
        const response = await api.get(`/groups/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el grupo:', error);
        throw error;
    }
};

export const createGroup = async (groupData) => {
    try {
        const response = await api.post('/groups/', groupData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al crear el grupo:', error);
        throw error;
    }
};

export const updateGroup = async (id, groupData) => {
    try {
        const response = await api.put(`/groups/${id}/`, groupData);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al actualizar el grupo:', error);
        throw error;
    }
};

export const deleteGroup = async (id) => {
    try {
        const response = await api.delete(`/groups/${id}/`);
        return response; // Devolver la respuesta completa
    } catch (error) {
        console.error('Error al eliminar el grupo:', error);
        throw error;
    }
};

export default api;