from django.urls import path
from .views import (
    EnrollmentListCreateView,
    EnrollmentDetailView,
    EnrollmentNextIdView,
    UserGroupsView
)

urlpatterns = [
    path('enrollments/', EnrollmentListCreateView.as_view(), name='enrollments-list-create'),  # Listar y crear
    path('enrollments/<int:pk>/', EnrollmentDetailView.as_view(), name='enrollments-detail'),  # Detalles, actualizar y eliminar
    path('enrollments/next_id/', EnrollmentNextIdView.as_view(), name='enrollments-next-id'),  # Obtener el siguiente ID
    path('enrollments/user/<int:user_id>/', UserGroupsView.as_view(), name='user-groups'), # Obtener los grupos de un usuario
]