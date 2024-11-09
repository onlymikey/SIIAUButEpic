from django.db import models
from groups.models import Group
from classrooms.models import Classroom

class Schedule(models.Model):

    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    day = models.CharField(max_length=10)
    start_at = models.TimeField()
    end_at = models.TimeField()

    def __str__(self):
        return f'{self.group} {self.classroom} {self.day} {self.start_at} {self.end_at}'