from django.db import models
from subjects.models import Subject
from auth_custom.models import CustomUser
from django.core.exceptions import ValidationError
from django.utils.dateparse import parse_date
from datetime import datetime

class Group(models.Model):
    
    name = models.CharField(max_length=5, unique=True)
    start_date = models.CharField(max_length=10)#DD-MM-YYYY
    end_date = models.CharField(max_length=10)#DD-MM-YYYY
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    study_period = models.CharField(max_length=5)#formato 2024B
    quantity_students = models.IntegerField(default=0)
    max_students = models.IntegerField()

    def clean(self):
        super().clean()

        # Validar formato de fechas
        try:
            start_date_obj = parse_date(self.start_date)
            end_date_obj = parse_date(self.end_date)
            if not start_date_obj or not end_date_obj:
                raise ValidationError("Las fechas deben seguir el formato DD-MM-YYYY.")
        except ValueError:
            raise ValidationError("Las fechas deben seguir el formato DD-MM-YYYY.")

        # Validar que la fecha de inicio no sea posterior a la fecha de finalización
        if start_date_obj and end_date_obj and start_date_obj > end_date_obj:
            raise ValidationError("La fecha de inicio no puede ser posterior a la fecha de finalización.")

        # Validar el formato del semestre (YYYYA)
        if not self.semester or len(self.semester) != 5:
            raise ValidationError("El formato del semestre debe ser YYYYA, donde A es una letra del calendario.")
        
        try:
            year = int(self.semester[:4])
            current_year = datetime.now().year
            if year < current_year:
                raise ValidationError("El año del semestre no puede ser menor al año actual.")
            calendar_letter = self.semester[4]
            if not calendar_letter.isalpha():
                raise ValidationError("El formato del semestre debe terminar en una letra del calendario (e.g., 2024B).")
        except ValueError:
            raise ValidationError("El formato del semestre debe ser YYYYA, donde A es una letra del calendario.")

        # Validar que el semestre no sea menor al año de la fecha de inicio
        if start_date_obj:
            if year < start_date_obj.year:
                raise ValidationError("El semestre no puede ser menor al año especificado en la fecha de inicio.")

    def save(self, *args, **kwargs):
        # Ejecutar validaciones antes de guardar
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.subject_id} - {self.teacher_id}"