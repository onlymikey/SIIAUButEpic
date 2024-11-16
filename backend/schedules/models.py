from django.db import models
from classrooms.models import Classroom
from groups.models import Group

class Schedule(models.Model):
    DAYS = (
        ('lunes', 'Lunes'),
        ('martes', 'Martes'),
        ('miércoles', 'Miércoles'),
        ('jueves', 'Jueves'),
        ('viernes', 'Viernes'),
        ('sábado', 'Sábado'),
    )
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    day = models.CharField(max_length=10, choices=DAYS)
    start_at = models.TimeField()
    end_at = models.TimeField()