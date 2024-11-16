from django.db import models
from auth_custom.models import CustomUser
from groups.models import Group

class Enrollment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

def __str__(self):
    return f"User: {self.user.username}, Group: {self.group.name}"