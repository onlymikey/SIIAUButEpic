from rest_framework import serializers
from .models import Enrollment
from groups.models import Group
from django.core.exceptions import ValidationError
from schedules.models import Schedule  # Asegúrate de importar el modelo Schedule

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

    def validate(self, data):
        user = data.get('user')
        group = data.get('group')

        # Verificar si el usuario ya está inscrito en otro grupo
        existing_enrollments = Enrollment.objects.filter(user=user)

        # Obtener los horarios del grupo en el que se va a inscribir
        new_group_schedules = Schedule.objects.filter(group=group)

        for enrollment in existing_enrollments:
            other_group = enrollment.group
            # Obtener los horarios del grupo actual del usuario
            existing_group_schedules = Schedule.objects.filter(group=other_group)

            # Comparar los horarios de ambos grupos
            for new_schedule in new_group_schedules:
                for existing_schedule in existing_group_schedules:
                    # Verificar si los horarios de los grupos se solapan
                    if new_schedule.day == existing_schedule.day:
                        if (new_schedule.start_at < existing_schedule.end_at and
                                new_schedule.end_at > existing_schedule.start_at):
                            raise ValidationError(
                                f"El horario del grupo {group.name} se solapa con otro grupo en el que ya está inscrito el usuario.")
        return data

    def create(self, validated_data):
        # Obtener el grupo relacionado y aumentar la cantidad de estudiantes
        group = validated_data['group']
        group.quantity_students += 1
        group.save()  # Guardar la actualización del grupo

        # Llamamos al método original de creación después de la validación
        return super().create(validated_data)
