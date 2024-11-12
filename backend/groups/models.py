from django.db import models
from subjects.models import Subject
from auth_custom.models import CustomUser
from classrooms.models import Classroom

class Group(models.Model):
    name = models.CharField(max_length=5, unique=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    day = models.CharField(max_length=10)
    start_at = models.TimeField()
    end_at = models.TimeField()
    quantity_students = models.IntegerField()

    def __str__(self):
        return f"Group: {self.name}, Subject: {self.subject.name}, Teacher: {self.teacher.username}, Students: {self.quantity_students}"

    
