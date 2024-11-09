from django.urls import path
from .views import ScheduleListCreateView, ScheduleDetailView

urlpatterns = [
    path('schedules/', ScheduleListCreateView.as_view(), name='schedules-list-create'),  # Listar y crear
    path('schedules/<int:pk>/', ScheduleDetailView.as_view(), name='schedules-detail'),  # Detalles, actualizar y eliminar
]