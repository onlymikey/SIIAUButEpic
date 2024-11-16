from django.core.exceptions import ValidationError
from django.db import models
from auth_custom.models import CustomUser
from groups.models import Group
from schedules.models import Schedule  # Asumiendo que el modelo de horarios está en schedules

class Enrollment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def clean(self):
        # Verificar solapamiento de horarios
        existing_enrollments = Enrollment.objects.filter(user=self.user).exclude(group=self.group)
        for enrollment in existing_enrollments:
            schedules = Schedule.objects.filter(group=enrollment.group)
            new_schedules = Schedule.objects.filter(group=self.group)
            for new_schedule in new_schedules:
                for schedule in schedules:
                    if (new_schedule.day == schedule.day and
                        new_schedule.start_at < schedule.end_at and
                        new_schedule.end_at > schedule.start_at):
                        raise ValidationError(
                            f"El horario del grupo '{self.group.name}' se solapa con el horario del grupo '{schedule.group.name}'."
                        )

    def __str__(self):
        return f"User: {self.user.username}, Group: {self.group.name}"