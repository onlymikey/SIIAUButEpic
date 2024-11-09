from rest_framework import generics
from .models import CustomUser
from .serializers import CustomUserSerializer

# Vista para listar todos los CustomUser
class CustomUserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

# Vista para obtener, actualizar y eliminar un solo CustomUser
class CustomUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer