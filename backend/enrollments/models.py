from django.db import models
from auth_custom.models import CustomUser
from groups.models import Group

class Enrollment(models.Model):
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)

def __str__(self):
    return f"User: {self.user.username}, Group: {self.group.name}"