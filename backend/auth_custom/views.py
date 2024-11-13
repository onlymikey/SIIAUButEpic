from rest_framework import generics
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.db import connection

class CustomUserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    
    # Sobrescribimos los permisos solo para esta vista
    def get_permissions(self):
        if self.request.method == 'POST':
            # Permitimos cualquier acceso para la creación de usuarios
            return [AllowAny()]
        return [IsAuthenticated()]

class CustomUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados

class CustomUserLoginView(APIView):
    permission_classes = [AllowAny]  # Permitimos cualquier acceso
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Si el usuario es válido, generar tokens JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({"detail": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED)
        
# Vista para obtener el siguiente ID que se usará en la tabla customUser.
class UserNextIdView(APIView):
    def get(self, request, *args, **kwargs):
        next_id = self.get_next_auto_increment_id('auth_custom_customuser')
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
