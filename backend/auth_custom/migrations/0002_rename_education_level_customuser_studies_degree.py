# Generated by Django 5.1.3 on 2024-11-15 07:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth_custom', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customuser',
            old_name='education_level',
            new_name='studies_degree',
        ),
    ]
