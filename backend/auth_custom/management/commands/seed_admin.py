from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Seed the database with an admin user'

    def handle(self, *args, **kwargs):
        # Obtener el modelo de usuario personalizado
        User = get_user_model()

        # Verificar si el usuario admin ya existe
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='securepassword',
                name='Admin',
                father_last_name='Admin',
                mother_last_name='System',
                role='career_admin',
                career=None  # Null porque es administrador
            )
            self.stdout.write(self.style.SUCCESS('Administrador creado con éxito'))
        else:
            self.stdout.write(self.style.WARNING('El administrador ya existe'))
