from rest_framework.viewsets import ModelViewSet
from .models import MediaFile
from .serializers import MediaFileSerializer
from rest_framework.permissions import IsAuthenticated
from .tasks import process_media_file

class MediaFileViewSet(ModelViewSet):
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        media = serializer.save()

    
       
        process_media_file.delay(media.id)