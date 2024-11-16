from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import EnrollmentSerializer
from .models import Enrollment
from groups.models import Group
from auth_custom.models import CustomUser
from django.db import connection


# vista para listar o crear todos los grupos
class EnrollmentListCreateView(generics.ListCreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

# Vista para obtener, actualizar y eliminar un solo grupo
class EnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    def perform_destroy(self, instance):
        group = instance.group
        group.quantity_students -= 1  # Decrementar la cantidad de estudiantes
        group.save()
        instance.delete()

# Vista para obtener el siguiente ID que se usará en la tabla enrollment.
class EnrollmentNextIdView(APIView):
    def get(self, request, *args, **kwargs):
        next_id = self.get_next_auto_increment_id('enrollments_enrollment')
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
    
# Vista para obtener los grupos de un usuario
class UserGroupsView(APIView):
    def get(self, request, user_id, *args, **kwargs):
        enrollments = Enrollment.objects.filter(user__id=user_id)
        groups = [enrollment.group for enrollment in enrollments]
        return Response({
            "user_id": user_id,
            "groups": [
                {
                    "id": group.id,
                    "name": group.name,
                    "start_date": group.start_date,
                    "end_date": group.end_date,
                } for group in groups
            ]
        })