from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django.db import connection, transaction, models
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from .serializers import GroupSerializer
from django.db.models import Prefetch
from .models import Group
from schedules.models import Schedule
from rest_framework import status, generics
from classrooms.models import Classroom
from schedules.serializers import ScheduleSerializer
from auth_custom.permissions import IsCareerAdmin
from rest_framework.permissions import IsAuthenticated


# Vista para listar todos los grupos (solo GET)
class GroupListView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Prefetch schedules relacionados para optimizar consultas
            groups = Group.objects.prefetch_related(
                Prefetch('schedule_set', queryset=Schedule.objects.all())
            ).all()

            # Serializar los datos de los grupos junto con los horarios
            data = []
            for group in groups:
                group_data = GroupSerializer(group).data
                schedules = Schedule.objects.filter(group=group)
                group_data['schedules'] = ScheduleSerializer(schedules, many=True).data
                data.append(group_data)

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Vista para obtener un grupo específico con sus horarios relacionados
class GroupDetailWithSchedulesView(APIView):
    """
    Vista para obtener un grupo específico con sus horarios relacionados.
    """
    def get(self, request, group_id, *args, **kwargs):
        # Obtén el grupo por su ID o devuelve 404 si no existe
        group = get_object_or_404(Group, id=group_id)
        
        # Serializa el grupo
        group_serializer = GroupSerializer(group)
        
        # Obtén los horarios relacionados
        schedules = Schedule.objects.filter(group=group)
        schedule_serializer = ScheduleSerializer(schedules, many=True)
        
        # Construye la respuesta
        response_data = group_serializer.data
        response_data['schedules'] = schedule_serializer.data

        return Response(response_data, status=status.HTTP_200_OK)
    
class GroupDeleteView(APIView):
    """
    Vista para eliminar un grupo y sus horarios relacionados.
    """
    def delete(self, request, group_id, *args, **kwargs):
        # Obtén el grupo por su ID o devuelve 404 si no existe
        group = get_object_or_404(Group, id=group_id)

        try:
            with transaction.atomic():
                # Elimina los horarios relacionados
                Schedule.objects.filter(group=group).delete()
                
                # Elimina el grupo
                group.delete()
                
            return Response(
                {"message": f"Grupo con ID {group_id} y sus horarios relacionados fueron eliminados."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
# Vista para actualizar un grupo y sus horarios relacionados
class GroupUpdateView(APIView):
    """
    Vista para actualizar un grupo y sus horarios relacionados.
    """

    def put(self, request, group_id, *args, **kwargs):
        return self.update_group(request, group_id, partial=False)

    def patch(self, request, group_id, *args, **kwargs):
        return self.update_group(request, group_id, partial=True)

    def update_group(self, request, group_id, partial):
        # Obtén el grupo por su ID o devuelve 404 si no existe
        group = get_object_or_404(Group, id=group_id)

        try:
            with transaction.atomic():
                # Actualizar el grupo
                group_serializer = GroupSerializer(group, data=request.data, partial=partial)
                if not group_serializer.is_valid():
                    return Response(group_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                group = group_serializer.save()

                # Actualizar los horarios relacionados (si se proporcionan en la solicitud)
                if "schedules" in request.data:
                    schedules_data = request.data["schedules"]

                    # Eliminar horarios antiguos (opcional, según tu lógica)
                    Schedule.objects.filter(group=group).delete()

                    # Crear o actualizar los nuevos horarios
                    for schedule_data in schedules_data:
                        schedule_data["group"] = group.id  # Asociar al grupo
                        schedule_serializer = ScheduleSerializer(data=schedule_data)
                        if not schedule_serializer.is_valid():
                            return Response(schedule_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                        schedule_serializer.save()

                # Obtener los horarios actualizados del grupo
                updated_schedules = Schedule.objects.filter(group=group)
                updated_schedules_serializer = ScheduleSerializer(updated_schedules, many=True)

                # Responder con el grupo y sus horarios actualizados
                return Response(
                    {
                        "message": "Grupo y horarios actualizados correctamente.",
                        "group": group_serializer.data,
                        "schedules": updated_schedules_serializer.data
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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