from django.urls import path
from .views import EnrollmentListCreateView, EnrollmentDetailView, EnrollmentByUserView

urlpatterns = [
    path('enrollments/', EnrollmentListCreateView.as_view(), name='enrollments-list-create'),  # Listar y crear
    path('enrollments/<int:pk>/', EnrollmentDetailView.as_view(), name='enrollments-detail'),  # Detalles, actualizar y eliminar
    path('enrollments/by_user/<int:user_id>/', EnrollmentByUserView.as_view(), name='enrollments-by-user'),  # Grupos por usuario
]