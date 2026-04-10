from rest_framework import serializers
from .models import MediaFile
import requests
import mimetypes
from django.core.files.base import ContentFile


class MediaFileSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    image_url = serializers.URLField(write_only=True, required=False)

    MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB

    class Meta:
        model = MediaFile
        fields = '__all__'
        read_only_fields = ['status', 'file_size', 'file_type']

    def validate_file(self, file):
        if file.size > self.MAX_FILE_SIZE:
            raise serializers.ValidationError("File size must be under 2MB")
        return file

    def create(self, validated_data):
        image_url = validated_data.pop('image_url', None)

        
        if not validated_data.get('file') and not image_url:
            raise serializers.ValidationError("Provide either file or image_url")

        
        if image_url:
            response = requests.get(image_url, timeout=5)

            if response.status_code != 200:
                raise serializers.ValidationError("Invalid image URL")

            content = response.content

    
            if len(content) > self.MAX_FILE_SIZE:
                raise serializers.ValidationError("File size must be under 2MB")

            content_type = response.headers.get('Content-Type')
            extension = mimetypes.guess_extension(content_type) or '.jpg'

            file_name = "downloaded_file" + extension
            validated_data['file'] = ContentFile(content, name=file_name)

        
        instance = super().create(validated_data)

        return instance