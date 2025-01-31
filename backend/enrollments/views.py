from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import EnrollmentSerializer
from .models import Enrollment
from groups.models import Group
from auth_custom.models import CustomUser
from django.db import connection
from schedules.models import Schedule
from auth_custom.permissions import IsCareerAdmin
from rest_framework.permissions import IsAuthenticated


# vista para listar o crear todos los grupos
class EnrollmentListCreateView(generics.ListCreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    # Sobrescribimos los permisos solo para creacion
    def get_permissions(self):
        return [IsAuthenticated()]

# Vista para obtener, actualizar y eliminar un solo grupo
class EnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    def get_permissions(self):
        return [IsAuthenticated()]

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
    
class UserGroupsView(APIView):
    def get(self, request, user_id, *args, **kwargs):
        # Filtrar las inscripciones del usuario por su ID
        enrollments = Enrollment.objects.filter(user__id=user_id)
        groups = [enrollment.group for enrollment in enrollments]

        response_data = {
            "user_id": user_id,
            "enrollments": [],
            "groups": []
        }

        for enrollment in enrollments:
            group = enrollment.group
            # Obtener los horarios relacionados con el grupo
            schedules = Schedule.objects.filter(group=group)
            schedule_data = [
                {
                    "day": schedule.day,
                    "start_at": schedule.start_at.strftime('%H:%M'),
                    "end_at": schedule.end_at.strftime('%H:%M'),
                    "classroom": {
                        "name": schedule.classroom.name,
                        "floor": schedule.classroom.floor
                    }
                }
                for schedule in schedules
            ]

            # Obtener datos de la materia relacionada con el grupo
            subject = group.subject

            # Agregar los datos del grupo, horarios y materia al JSON de respuesta
            response_data["groups"].append({
                "id": group.id,
                "name": group.name,
                "start_date": group.start_date,
                "end_date": group.end_date,
                "study_period": group.study_period,
                "quantity_students": group.quantity_students,
                "max_students": group.max_students,
                "teacher": {
                    "id": group.teacher.id,
                    "name": group.teacher.get_full_name(),  # Supone que `CustomUser` tiene este método
                    "email": group.teacher.email
                },
                "subject": {
                    "id": subject.id,
                    "name": subject.name,
                    "credits": subject.credits,
                    "semester": subject.semester
                },
                "schedules": schedule_data
            })

            # Agregar el ID del enrollment al JSON de respuesta
            response_data["enrollments"].append({
                "enrollment_id": enrollment.id,
                "group_id": group.id
            })

        return Response(response_data)
