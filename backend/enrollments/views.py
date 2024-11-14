from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import EnrollmentSerializer
from .models import Enrollment
from groups.models import Group
from auth_custom.models import CustomUser


# vista para listar o crear todos los grupos
class EnrollmentListCreateView(generics.ListCreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

# Vista para obtener, actualizar y eliminar un solo grupo
class EnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

# vista para obtener todos los grupos por usuario y organizarlos por dia
class EnrollmentByUserView(APIView):
    def get(self, request, user_id):
        # Obtener el usuario
        user = get_object_or_404(CustomUser, id=user_id)

        # Filtrar las inscripciones por el usuario
        enrollments = Enrollment.objects.filter(user=user).select_related('group')
        """"DE AQUI HACIA ABAJO TODO CAMBIA DEPENDIENDO DE LA LOGICA QUE QUERRAMOS PARA LOS GRUPOS"""
        # # Diccionario para organizar los grupos por día
        # grouped_by_day = {}

        # for enrollment in enrollments:
        #     group = enrollment.group
        #     day = group.day  # Suponiendo que "day" es un atributo de Group

        #     # Inicializar la lista para el día si aún no existe
        #     if day not in grouped_by_day:
        #         grouped_by_day[day] = []

        #     # Agregar el grupo al día correspondiente
        #     grouped_by_day[day].append({
        #         'group_id': group.id,
        #         'name': group.name,
        #         'description': group.description,
        #         # Agregar más atributos si es necesario
        #     })

        # # Devolver el JSON agrupado por día
        # return Response(grouped_by_day)