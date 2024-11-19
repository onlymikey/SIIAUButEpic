from django.db import models
from careers.models import Career

class Subject(models.Model):
    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    credits = models.IntegerField()
    semester = models.IntegerField()
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'nombre: {self.name}, carrera: {self.career.name}'