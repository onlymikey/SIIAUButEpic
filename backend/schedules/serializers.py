from rest_framework import serializers
from .models import Schedule, Classroom


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['group', 'classroom', 'day', 'start_at', 'end_at']

    def validate(self, data):
        # Verificar si el aula existe (si no lo hace, lanzamos un error)
        try:
            classroom = Classroom.objects.get(id=data['classroom'].id)
        except Classroom.DoesNotExist:
            raise serializers.ValidationError("El aula especificada no existe.")
        
        # Validar que el horario no se solape con otro (opcional)
        overlapping_schedules = Schedule.objects.filter(
            classroom=classroom,
            day=data['day'],
            start_at__lt=data['end_at'],
            end_at__gt=data['start_at']
        )
        
        if overlapping_schedules.exists():
            raise serializers.ValidationError("El horario se solapa con otro en el aula.")
        
        return data
