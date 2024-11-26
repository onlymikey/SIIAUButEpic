from django.urls import path
from .views import GroupListView, GroupNextIdView, GroupCreateView, GroupDetailWithSchedulesView, GroupDeleteView, GroupUpdateView

urlpatterns = [
    path('groups/', GroupListView.as_view(), name='groups-list'),  # Listar todos los grupos
    path('groups/next-id/', GroupNextIdView.as_view(), name='groups-next-id'),  # Obtener el próximo ID
    path('groups/create/', GroupCreateView.as_view(), name='groups-create'),  # Crear grupo y horarios
    path('groups/<int:group_id>/schedules/', GroupDetailWithSchedulesView.as_view(), name='groups-schedules'),  # Detalles de un grupo con sus horarios
    path('groups/<int:group_id>/delete/', GroupDeleteView.as_view(), name='groups-delete'),  # Eliminar un grupo y sus horarios
    path('groups/<int:group_id>/update/', GroupUpdateView.as_view(), name='groups-update'),  # Actualizar un grupo y sus horarios
]