from rest_framework import generics
from .models import Group
from .serializers import GroupSerializer

# Vista para listar todos los grupos
class GroupListCreateView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

# Vista para obtener, actualizar y eliminar un solo grupo
class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer