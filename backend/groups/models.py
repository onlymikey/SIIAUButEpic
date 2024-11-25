from django.db import models
from subjects.models import Subject
from auth_custom.models import CustomUser
from django.core.exceptions import ValidationError
from datetime import datetime

class Group(models.Model):
    name = models.CharField(max_length=5, unique=True)
    start_date = models.CharField(max_length=10)  # DD-MM-YYYY
    end_date = models.CharField(max_length=10)  # DD-MM-YYYY
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    study_period = models.CharField(max_length=5)  # Formato 2024B
    quantity_students = models.IntegerField(default=0)
    max_students = models.IntegerField()

    def clean(self):
        super().clean()
        errors = {}

        # Validar formato de fechas con datetime.strptime
        try:
            start_date_obj = datetime.strptime(self.start_date, "%d-%m-%Y").date()
        except ValueError:
            errors["start_date"] = "La fecha de inicio debe seguir el formato DD-MM-YYYY."

        try:
            end_date_obj = datetime.strptime(self.end_date, "%d-%m-%Y").date()
        except ValueError:
            errors["end_date"] = "La fecha de finalización debe seguir el formato DD-MM-YYYY."

        # Validar que la fecha de inicio no sea posterior a la fecha de finalización
        if "start_date" not in errors and "end_date" not in errors:
            if start_date_obj > end_date_obj:
                errors["start_date"] = "La fecha de inicio no puede ser posterior a la fecha de finalización."

        # Validar el formato del periodo de estudio (YYYYA)
        if not self.study_period or len(self.study_period) != 5:
            errors["study_period"] = "El formato del periodo de estudio debe ser YYYYA, donde A es una letra del calendario."
        else:
            try:
                year = int(self.study_period[:4])
            except ValueError:
                errors["study_period"] = "Los primeros 4 caracteres del periodo de estudio deben ser un año válido."
            else:
                current_year = datetime.now().year
                if year < current_year:
                    errors["study_period"] = "El año del periodo de estudio no puede ser menor al año actual."
                calendar_letter = self.study_period[4]
                if not calendar_letter.isalpha():
                    errors["study_period"] = "El formato del periodo de estudio debe terminar en una letra del calendario (e.g., 2024B)."

                # Validar que el periodo de estudio no sea menor al año de la fecha de inicio
                if "start_date" not in errors and year < start_date_obj.year:
                    errors["study_period"] = "El periodo de estudio no puede ser menor al año especificado en la fecha de inicio."

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        # Ejecutar validaciones antes de guardar
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.subject_id} - {self.teacher_id}"
