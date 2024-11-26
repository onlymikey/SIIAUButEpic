from django.urls import path
from .views import SubjectListCreateView, SubjectDetailView, SubjectNextIdView

urlpatterns = [
    path('subjects/', SubjectListCreateView.as_view(), name='subjects-list-create'),  # Listar y crear
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subjects-detail'),  # Detalles, actualizar y eliminar
    path('subjects/next-id/', SubjectNextIdView.as_view(), name='subjects-next-id'),  # Obtener el próximo ID
]