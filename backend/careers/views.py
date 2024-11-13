from rest_framework import generics
from django.db import connection
from rest_framework.response import Response
from rest_framework.views import APIView
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

# vista para obtener el siguiente id de la carrera (del registro en caso de que se desee crear)
class CareerNextIdView(generics.ListCreateAPIView):
    queryset = Career.objects.all()
    serializer_class = CareerSerializer

# Vista para obtener el siguiente ID que se usará en la tabla Career.
class CareerNextIdView(APIView):
    def get(self, request, *args, **kwargs):
        next_id = self.get_next_auto_increment_id('careers_career')
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
