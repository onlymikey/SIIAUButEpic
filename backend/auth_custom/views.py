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