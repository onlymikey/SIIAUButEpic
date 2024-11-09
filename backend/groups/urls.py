from django.urls import path
from .views import GroupListCreateView, GroupDetailView

urlpatterns = [
    path('groups/', GroupListCreateView.as_view(), name='groups-list-create'),  # Listar y crear
    path('groups/<int:pk>/', GroupDetailView.as_view(), name='groups-detail'),  # Detalles, actualizar y eliminar
]