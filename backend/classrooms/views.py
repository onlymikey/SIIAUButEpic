from rest_framework import generics
from .models import Classroom
from .serializers import ClassroomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connection
from auth_custom.permissions import IsCareerAdmin
from rest_framework.permissions import IsAuthenticated

# Vista para listar todos los salones
class ClassroomListCreateView(generics.ListCreateAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

    # Sobrescribimos los permisos solo para creacion
    def get_permissions(self):
        if self.request.method == 'POST':
            # solo career_admin puede crear carreras
            return [IsCareerAdmin()]
        return [IsAuthenticated()]

# Vista para obtener, actualizar y eliminar un solo salon
class ClassroomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            # Solo career_admin puede actualizar o eliminar usuarios
            return [IsCareerAdmin()]
        return [IsAuthenticated()]

# Vista para obtener el siguiente ID que se usará en la tabla classroom.
class ClassroomNextIdView(APIView):
    def get(self, request, *args, **kwargs):
        next_id = self.get_next_auto_increment_id('classrooms_classroom')
        return Response({'next_id': next_id})

    def get_next_auto_increment_id(self, table_name):
        """
        Consulta para obtener el próximo valor de AUTO_INCREMENT de la tabla.
        """
        with connection.cursor() as cursor:
            cursor.execute(f"SHOW TABLE STATUS WHERE Name=%s", [table_name])
            row = cursor.fetchone()
            auto_increment_value = row[10]  # La columna AUTO_INCREMENT es la 11ª en la respuesta.
            if(auto_increment_value == None):
                auto_increment_value = 1
        return auto_increment_value
