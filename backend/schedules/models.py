from django.db import models
from classrooms.models import Classroom
from groups.models import Group
from django.core.exceptions import ValidationError
import datetime

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

    def clean(self):
        super().clean()

        #limites de horario
        min_start_time = datetime.time(7, 0)
        max_end_time = datetime.time(19, 0)

        if self.start_at < min_start_time:
            raise ValidationError({'start_at': f'El horario de inicio no puede ser antes de {min_start_time}.'})
        if self.end_at > max_end_time:
            raise ValidationError({'end_at': f'El horario de fin no puede ser después de {max_end_time}.'})
        if self.start_at >= self.end_at:
            raise ValidationError('El horario de inicio debe ser menor al horario de fin.')

    def save(self, *args, **kwargs):
        # Valida antes de guardar
        self.clean()
        super().save(*args, **kwargs)