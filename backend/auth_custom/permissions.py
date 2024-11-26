from rest_framework.permissions import BasePermission

class IsCareerAdmin(BasePermission):
    """
    Permiso personalizado para validar si el usuario tiene el rol de 'career_admin'.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'career_admin'
