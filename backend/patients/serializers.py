from rest_framework import serializers
from .models import Patient, Tag, PatientTag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class PatientSerializer(serializers.ModelSerializer):
    doctor = serializers.StringRelatedField()
    tags = serializers.SerializerMethodField()

    
    tags_input = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Patient
        fields = ['id', 'name', 'doctor', 'created_at', 'tags', 'tags_input']
        extra_kwargs = {
            'doctor': {'required': False}
        }


    def get_tags(self, obj):
        tags = Tag.objects.filter(patienttag__patient=obj)
        return TagSerializer(tags, many=True).data

    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags_input', [])

        patient = Patient.objects.create(**validated_data)

        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            PatientTag.objects.create(patient=patient, tag=tag)

        return patient