from django.urls import path
from .views import EnrollmentListCreateView, EnrollmentDetailView, EnrollmentByUserView, EnrollmentNextIdView

urlpatterns = [
    path('enrollments/', EnrollmentListCreateView.as_view(), name='enrollments-list-create'),  # Listar y crear
    path('enrollments/<int:pk>/', EnrollmentDetailView.as_view(), name='enrollments-detail'),  # Detalles, actualizar y eliminar
    path('enrollments/by_user/<int:user_id>/', EnrollmentByUserView.as_view(), name='enrollments-by-user'),  # Grupos por usuario
    path('enrollments/next_id/', EnrollmentNextIdView.as_view(), name='enrollments-next-id'),  # Obtener el siguiente ID
]