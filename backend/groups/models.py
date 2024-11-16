from django.db import models
from subjects.models import Subject
from auth_custom.models import CustomUser

class Group(models.Model):
    
    name = models.CharField(max_length=5, unique=True)
    start_date = models.CharField(max_length=10)#DD-MM-YYYY
    end_date = models.CharField(max_length=10)#DD-MM-YYYY
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    semester = models.CharField(max_length=5)#formato 2024B
    quantity_students = models.IntegerField(default=0)
    max_students = models.IntegerField()

    def __str__(self):
        return f"{self.name} - {self.subject_id} - {self.teacher_id}"