from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django.db import connection, transaction, models
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from .serializers import GroupSerializer
from .models import Group
from schedules.models import Schedule
from rest_framework import status, generics
from classrooms.models import Classroom
from schedules.serializers import ScheduleSerializer
from auth_custom.permissions import IsCareerAdmin
from rest_framework.permissions import IsAuthenticated


# Vista para listar todos los grupos (solo GET)
class GroupListView(ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

# Vista para obtener, actualizar y eliminar un solo grupo
class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            # Solo career_admin puede actualizar o eliminar usuarios
            return [IsCareerAdmin()]
        return [IsAuthenticated()]

# Vista para obtener el próximo ID de la tabla groups_group
class GroupNextIdView(APIView):
    def get(self, request, *args, **kwargs):
        next_id = self.get_next_auto_increment_id('groups_group')
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

# Vista para crear un grupo con sus horarios
class GroupCreateView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data

        group_serializer = GroupSerializer(data=data)
        if not group_serializer.is_valid():
            return Response(group_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                group = group_serializer.save(quantity_students=0)

                schedules = []
                for key, schedule_data in data.items():
                    if key.startswith("schedule") and isinstance(schedule_data, dict):
                        schedule_data['group'] = group.id

                        schedule_serializer = ScheduleSerializer(data=schedule_data)
                        if schedule_serializer.is_valid():
                            schedules.append(schedule_serializer.save())
                        else:
                            raise DRFValidationError(schedule_serializer.errors)

                if schedules:
                    return Response({
                        "message": "Grupo y horarios creados exitosamente",
                        "group_id": group.id
                    }, status=status.HTTP_201_CREATED)

                raise DRFValidationError("No se crearon horarios.")

        except DjangoValidationError as e:
            # Error de validación en Django
            return Response(e.message_dict if hasattr(e, 'message_dict') else str(e), status=status.HTTP_400_BAD_REQUEST)

        except DRFValidationError as e:
            # Error de validación en DRF
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Error genérico
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)