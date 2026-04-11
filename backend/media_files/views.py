import logging
logger = logging.getLogger("app")

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
        logger.info("media_uploaded media_id=%s actor_id=%s", media.id, self.request.user.id)

        process_media_file.delay(media.id)
        logger.info("media_processing_queued media_id=%s actor_id=%s", media.id, self.request.user.id)
