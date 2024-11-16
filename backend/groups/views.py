from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connection, transaction, models
from .serializers import GroupSerializer
from .models import Group
from schedules.models import Schedule
from rest_framework import status, generics
from classrooms.models import Classroom
from schedules.serializers import ScheduleSerializer


# Vista para listar todos los grupos
class GroupListCreateView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

# Vista para obtener, actualizar y eliminar un solo grupo
class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

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

# Vista para crear el grupo y LOS HORARIOS (registro con relaciones a horario) con el json que se reciba en la solicitud
class GroupCreateView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data

        # Validar datos principales del grupo
        group_serializer = GroupSerializer(data=data)
        if not group_serializer.is_valid():
            return Response({
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Datos inválidos para el grupo",
                    "details": group_serializer.errors
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Usar transacción atómica para que todo se maneje como una sola unidad
            with transaction.atomic():
                # Crear el grupo
                group = group_serializer.save(quantity_students=0)  # Inicialmente sin estudiantes
                
                schedules = []
                # Iterar sobre las claves "scheduleX" y crear horarios
                for key, schedule_data in data.items():
                    if key.startswith("schedule") and isinstance(schedule_data, dict) and schedule_data:
                        # Añadir el ID del grupo al schedule_data
                        schedule_data['group'] = group.id

                        # Usar el ScheduleSerializer para validar y guardar el horario
                        schedule_serializer = ScheduleSerializer(data=schedule_data)

                        if schedule_serializer.is_valid():
                            schedules.append(schedule_serializer.save())
                        else:
                            raise ValueError({
                                "code": "VALIDATION_ERROR",
                                "message": "Datos inválidos para los horarios",
                                "details": schedule_serializer.errors
                            })

                # Si se crearon horarios, regresar respuesta exitosa
                if schedules:
                    return Response({
                        "message": "Grupo y horarios creados exitosamente",
                        "group_id": group.id
                    }, status=status.HTTP_201_CREATED)
                else:
                    raise ValueError({
                        "code": "NO_SCHEDULES_CREATED",
                        "message": "No se crearon horarios",
                        "details": {}
                    })

        except Classroom.DoesNotExist:
            return Response({
                "error": {
                    "code": "CLASSROOM_NOT_FOUND",
                    "message": "El aula especificada no existe",
                    "details": {}
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        except ValueError as e:
            # Manejo de errores personalizados en el proceso de creación
            error_data = e.args[0] if isinstance(e.args[0], dict) else {
                "code": "UNKNOWN_ERROR",
                "message": str(e),
                "details": {}
            }
            return Response({"error": error_data}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Manejo de errores no controlados
            return Response({
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "Ocurrió un error al procesar la solicitud",
                    "details": str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)