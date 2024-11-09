# careers/serializers.py
from rest_framework import serializers
from .models import Career

class CareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = '__all__'  # Esto incluye todos los campos del modelo
