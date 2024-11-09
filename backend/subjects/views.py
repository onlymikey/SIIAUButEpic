from rest_framework import generics
from .models import Subject
from .serializers import SubjectSerializer

# Vista para listar todas las materias
class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

# Vista para obtener, actualizar y eliminar una sola materia
class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer