from django.urls import path
from .views import CareerListCreateView, CareerDetailView, CareerNextIdView, SubjectsByCareerView

urlpatterns = [
    path('careers/', CareerListCreateView.as_view(), name='careers-list-create'),  # Listar y crear
    path('careers/<int:pk>/', CareerDetailView.as_view(), name='careers-detail'),  # Detalles, actualizar y eliminar
    path('careers/next-id/', CareerNextIdView.as_view(), name='careers-next-id'),  # Obtener el siguiente ID
    path('careers/<int:career_id>/subjects/', SubjectsByCareerView.as_view(), name='subjects-by-career'), #Obtener las materias por ID de carrera.
]
