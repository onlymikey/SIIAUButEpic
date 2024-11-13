from django.urls import path
from .views import GroupListCreateView, GroupDetailView, GroupNextIdView

urlpatterns = [
    path('groups/', GroupListCreateView.as_view(), name='groups-list-create'),  # Listar y crear
    path('groups/<int:pk>/', GroupDetailView.as_view(), name='groups-detail'),  # Detalles, actualizar y eliminar
    path('groups/next-id/', GroupNextIdView.as_view(), name='groups-next-id'),  # Obtener el próximo ID
]