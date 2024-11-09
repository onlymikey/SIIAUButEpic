from django.db import models

class Career(models.Model):
    name = models.CharField(max_length=100)
    semester_quantity = models.IntegerField()

    def __str__(self):
        return f'nombre: {self.name}, cantidad de semestres: {self.semester_quantity}'