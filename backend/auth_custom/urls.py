from django.urls import path
from .views import (
    CustomUserListCreateView,
    CustomUserDetailView,
    CustomUserLoginView,
    UserNextIdView,
    DeactivateUserView,
    ReactivateUserView
    )

urlpatterns = [
    path('users/', CustomUserListCreateView.as_view(), name='users-list-create'),  # Listar y crear
    path('users/<int:pk>/', CustomUserDetailView.as_view(), name='users-detail'),  # Detalles, actualizar y eliminar
    path('users/next-id/', UserNextIdView.as_view(), name='users-next-id'),  # Obtener siguiente ID
    path('users/<int:user_id>/deactivate/', DeactivateUserView.as_view(), name='users-deactivate'),  # Desactivar usuario
    path('users/<int:user_id>/reactivate/', ReactivateUserView.as_view(), name='users-reactivate'),  # Reactivar usuario
    path('login/', CustomUserLoginView.as_view(), name='login'),  # Login

]