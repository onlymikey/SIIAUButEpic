from django.urls import path
from .views import ClassroomListCreateView, ClassroomDetailView, ClassroomNextIdView

urlpatterns = [
    path('classrooms/', ClassroomListCreateView.as_view(), name='classrooms-list-create'),  # Listar y crear
    path('classrooms/<int:pk>/', ClassroomDetailView.as_view(), name='classrooms-detail'),  # Detalles, actualizar y eliminar
    path('classrooms/next-id/', ClassroomNextIdView.as_view(), name='classrooms-next-id'),  # Obtener el siguiente ID
]