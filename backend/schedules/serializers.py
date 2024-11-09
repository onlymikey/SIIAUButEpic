from rest_framework import serializers
from .models import Schedule

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'  # Esto incluye todos los campos del modelo