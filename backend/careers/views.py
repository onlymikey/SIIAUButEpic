from rest_framework import generics
from .models import Career
from .serializers import CareerSerializer

# Vista para listar todos los careers
class CareerListCreateView(generics.ListCreateAPIView):
    queryset = Career.objects.all()
    serializer_class = CareerSerializer

# Vista para obtener, actualizar y eliminar un solo career
class CareerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Career.objects.all()
    serializer_class = CareerSerializer
