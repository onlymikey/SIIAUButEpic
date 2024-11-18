from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser
from django.core.exceptions import ValidationError

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'birthdate', 'email', 'name', 'studies_degree', 'father_last_name', 'mother_last_name', 'role', 'career', 'password']

    # Sobrescribimos create para manejar el hash de la contraseña al crear un usuario
    def create(self, validated_data):
        # Si no se proporciona contraseña, lanza un error
        if 'password' not in validated_data or not validated_data['password']:
            raise serializers.ValidationError({"password": "Este campo es requerido al crear un usuario."})
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    # También sobrescribimos update para el mismo propósito si se actualiza la contraseña
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        else:
            validated_data.pop('password', None)
        return super().update(instance, validated_data)
    
    def validate(self, data):
        # Validación personalizada para el rol 'teacher'
        if data.get('role') == 'teacher' and not data.get('studies_degree'):
            raise serializers.ValidationError({
                'studies_degree': 'Studies degree is required for teachers.'
            })
        # Validación personalizada para el rol 'student'
        if data.get('role') == 'student' and not data.get('birthdate'):
            raise serializers.ValidationError({
                'birthdate': 'Birthdate is required for students.'
            })
        if data.get('role') == 'student' and not data.get('career'):
            raise serializers.ValidationError({
                'career': 'Career is required for students.'
            })
        return data
