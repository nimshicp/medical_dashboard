from django.contrib import admin
from .models import Patient, Tag, PatientTag

# Register your models here.
admin.site.register(Patient)
admin.site.register(Tag)
admin.site.register(PatientTag)