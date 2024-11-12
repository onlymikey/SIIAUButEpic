from django.contrib.auth.models import AbstractUser
from django.db import models
from careers.models import Career

class CustomUser(AbstractUser):
    ROLES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('career_admin', 'Career Admin'),
    )
    #relacion con la carrera (puede ser nulo en caso de administrador)
    career_id = models.ForeignKey(Career, on_delete=models.CASCADE, null=True, blank=True)
    #campos obligatorios
    name = models.CharField(max_length=100)
    father_last_name = models.CharField(max_length=100)
    mother_last_name = models.CharField(max_length=100)
    birthdate = models.CharField(max_length=15)
    #campo de rol
    role = models.CharField(max_length=20, choices=ROLES, default='student')

    # Solucionar conflicto con auth.User
    groups = models.ManyToManyField('auth.Group', related_name='customuser_groups', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='customuser_permissions', blank=True)

    def __str__(self):
        return self.username
