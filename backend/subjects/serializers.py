from rest_framework import serializers
from .models import Subject

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'  # Esto incluye todos los campos del modelo

    def validate(self, data):
        """
        Validación personalizada para asegurar que el semestre de la materia
        no supere la cantidad de semestres de la carrera.
        """
        career = data.get('career')
        semester = data.get('semester')

        if semester > career.semester_quantity:
            raise serializers.ValidationError(
                f"El semestre {semester} excede el máximo permitido para esta carrera ({career.semester_quantity} semestres)."
            )
        return data