from django.urls import path
from .views import SubjectListCreateView, SubjectDetailView

urlpatterns = [
    path('subjects/', SubjectListCreateView.as_view(), name='subjects-list-create'),  # Listar y crear
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subjects-detail'),  # Detalles, actualizar y eliminar
]