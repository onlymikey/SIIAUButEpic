from rest_framework import generics
from .models import Subject
from .serializers import SubjectSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connection

# Vista para listar todas las materias
class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

# Vista para obtener, actualizar y eliminar una sola materia
class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

# Vista para obtener el próximo ID de la tabla subjects_subject
class UserNextIdView(APIView):
    def get(self, request, *args, **kwargs):
        next_id = self.get_next_auto_increment_id('subjects_subject')
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
