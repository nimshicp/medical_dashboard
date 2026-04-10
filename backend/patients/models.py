
from django.db import models

class Patient(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    doctor = models.ForeignKey('users.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

class Tag(models.Model):
    name = models.CharField(max_length=100, db_index=True)

    def __str__(self):
        return self.name


class PatientTag(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)    