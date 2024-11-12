from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'birthdate', 'email', 'name', 'father_last_name', 'mother_last_name', 'role', 'career_id', 'password']

    # Sobrescribimos create para manejar el hash de la contraseña al crear un usuario
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(CustomUserSerializer, self).create(validated_data)

    # También sobrescribimos update para el mismo propósito si se actualiza la contraseña
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super(CustomUserSerializer, self).update(instance, validated_data)
