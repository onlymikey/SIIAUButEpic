from rest_framework import generics
from .models import Schedule
from .serializers import ScheduleSerializer

# Vista para listar todos los horarios
class ScheduleListCreateView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

# Vista para obtener, actualizar y eliminar un solo horario
class ScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
