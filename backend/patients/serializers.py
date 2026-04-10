from rest_framework import serializers
from .models import Patient, Tag, PatientTag
from users.models import User




class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']




class PatientSerializer(serializers.ModelSerializer):
    doctor = serializers.StringRelatedField(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='doctor'),
        source='doctor',
        required=False,
        allow_null=True
    )
    tags = serializers.SerializerMethodField()


    tags_input = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Patient
        fields = ['id', 'name', 'doctor', 'doctor_id', 'created_at', 'tags', 'tags_input']
        extra_kwargs = {
            'doctor': {'required': False}
        }

    

    def get_tags(self, obj):
        tags = Tag.objects.filter(patienttag__patient=obj)
        return TagSerializer(tags, many=True).data

    

    def create(self, validated_data):
        tags_data = validated_data.pop('tags_input', [])

        # Create patient
        patient = Patient.objects.create(**validated_data)

        # Add tags
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            PatientTag.objects.create(patient=patient, tag=tag)

        return patient

    

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags_input', None)

        
        instance.name = validated_data.get('name', instance.name)
        if 'doctor' in validated_data:
            instance.doctor = validated_data['doctor']
        instance.save()

        if tags_data is not None:
            
            tag_objects = []
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                tag_objects.append(tag)

            
            PatientTag.objects.filter(patient=instance).exclude(
                tag__in=tag_objects
            ).delete()

            
            for tag in tag_objects:
                PatientTag.objects.get_or_create(
                    patient=instance,
                    tag=tag
                )

        return instance
