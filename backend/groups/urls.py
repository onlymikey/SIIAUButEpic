from django.urls import path
from .views import GroupListView, GroupDetailView, GroupNextIdView, GroupCreateView

urlpatterns = [
    path('groups/', GroupListView.as_view(), name='groups-list'),  # Listar todos los grupos
    path('groups/<int:pk>/', GroupDetailView.as_view(), name='groups-detail'),  # Detalles, actualizar y eliminar
    path('groups/next-id/', GroupNextIdView.as_view(), name='groups-next-id'),  # Obtener el próximo ID
    path('groups/create/', GroupCreateView.as_view(), name='groups-create'),  # Crear grupo y horarios
]