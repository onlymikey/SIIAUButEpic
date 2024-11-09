from django.urls import path
from .views import CareerListCreateView, CareerDetailView

urlpatterns = [
    path('careers/', CareerListCreateView.as_view(), name='careers-list-create'),  # Listar y crear
    path('careers/<int:pk>/', CareerDetailView.as_view(), name='careers-detail'),  # Detalles, actualizar y eliminar
]
