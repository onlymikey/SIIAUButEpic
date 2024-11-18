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
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import NotFound
from rest_framework.exceptions import PermissionDenied
from .permissions import IsCareerAdmin

class CustomUserListCreateView(generics.ListCreateAPIView):
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(is_active=True)
    
    # Sobrescribimos los permisos solo para esta vista
    def get_permissions(self):
        if self.request.method == 'POST':
            # Permitimos cualquier acceso para la creación de usuarios
            return [IsCareerAdmin()]
        return [IsAuthenticated()]

class CustomUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados
    
    def get_queryset(self):
        return CustomUser.objects.filter(is_active=True)
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            # Solo career_admin puede actualizar o eliminar usuarios
            return [IsCareerAdmin()]
        return [IsAuthenticated()]
    
    def perform_update(self, serializer):
        # Validamos si el usuario está activo
        instance = self.get_object()
        if not instance.is_active:
            raise ValidationError({"detail": "No se puede actualizar un usuario inactivo."})
        serializer.save()

class DeactivateUserView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados

    def patch(self, request, user_id, *args, **kwargs):
        # Verificar si el usuario autenticado tiene el rol de career_admin
        if request.user.role != 'career_admin':
            raise PermissionDenied({"detail": "No tienes permiso para desactivar usuarios."})
        
        try:
            # Obtener al usuario objetivo
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise NotFound({"detail": "Usuario no encontrado."})

        # Validar que el usuario no esté ya desactivado
        if not user.is_active:
            raise ValidationError({"detail": "El usuario ya está desactivado."})
        
        # Desactivar el usuario
        user.is_active = False
        user.save()

        return Response(
            {"detail": f"El usuario {user.username} ha sido desactivado."},
            status=status.HTTP_200_OK
        )
    
class ReactivateUserView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados

    def patch(self, request, user_id, *args, **kwargs):
        # Verificar si el usuario autenticado tiene el rol de career_admin
        if request.user.role != 'career_admin':
            raise PermissionDenied({"detail": "No tienes permiso para reactivar usuarios."})
        
        try:
            # Obtener al usuario objetivo
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise NotFound({"detail": "Usuario no encontrado."})

        # Validar que el usuario esté desactivado antes de intentar activarlo
        if user.is_active:
            raise ValidationError({"detail": "El usuario ya está activo."})
        
        # Activar el usuario
        user.is_active = True
        user.save()

        return Response(
            {"detail": f"El usuario {user.username} ha sido reactivado."},
            status=status.HTTP_200_OK
        )

class CustomUserLoginView(APIView):
    permission_classes = [AllowAny]  # Permitimos cualquier acceso
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Si el usuario es válido, generar tokens JWT
            refresh = RefreshToken.for_user(user)

            # Serializar la información del ususario
            user_data = CustomUserSerializer(user).data

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data,
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
