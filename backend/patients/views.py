# patients/views.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db.models import Q

from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    
    def get_queryset(self):
        user = self.request.user
        qs = Patient.objects.all()

        #  RBAC (Role-Based Access)
        if user.role == 'doctor':
            qs = qs.filter(doctor=user)

        
        name = self.request.query_params.get('name')
        tag = self.request.query_params.get('tag')
        date = self.request.query_params.get('date')

        if name:
            qs = qs.filter(name__icontains=name)

        if tag:
            qs = qs.filter(patienttag__tag__name__icontains=tag)

        if date:
            qs = qs.filter(created_at__date=date)

        return qs.distinct()
        
    def perform_create(self, serializer):
        user = self.request.user

        if user.role == 'doctor':
            serializer.save(doctor=user)

        elif user.role == 'admin':
            doctor = serializer.validated_data.get('doctor')
            if not doctor:
                raise ValidationError({"doctor_id": "Admin must assign a doctor."})
            serializer.save()

        
