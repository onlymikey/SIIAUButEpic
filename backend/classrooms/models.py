from django.db import models

class Classroom(models.Model):
    name = models.CharField(max_length=5)
    floor = models.IntegerField()
    
    def __str__(self):
        return f"{self.name} - {self.floor}"