from django.urls import path
from .views import CustomUserListCreateView, CustomUserDetailView, CustomUserLoginView

urlpatterns = [
    path('users/', CustomUserListCreateView.as_view(), name='users-list-create'),  # Listar y crear
    path('users/<int:pk>/', CustomUserDetailView.as_view(), name='users-detail'),  # Detalles, actualizar y eliminar
    path('login/', CustomUserLoginView.as_view(), name='login'),  # Login
]