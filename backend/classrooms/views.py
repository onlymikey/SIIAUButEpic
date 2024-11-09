from rest_framework import generics
from .models import Classroom
from .serializers import ClassroomSerializer

# Vista para listar todos los salones
class ClassroomListCreateView(generics.ListCreateAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

# Vista para obtener, actualizar y eliminar un solo salon
class ClassroomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer