from celery import shared_task
from .models import MediaFile
import time
import os
import logging


logger = logging.getLogger("app")

@shared_task
def process_media_file(media_id):
    logger.info("media_processing_started media_id=%s", media_id)
    try:
        media = MediaFile.objects.get(id=media_id)

        
        media.status = 'PROCESSING'
        media.save()

        
        time.sleep(5)

        
        if media.file:
            media.file_size = media.file.size

            ext = os.path.splitext(media.file.name)[1]
            media.file_type = ext.replace('.', '').upper()


        media.status = 'COMPLETED'
        media.save()
        logger.info("media_processing_completed media_id=%s status=%s", media_id, media.status)

    except MediaFile.DoesNotExist:
        logger.error("media_processing_missing_media media_id=%s", media_id)
    except Exception:
        logger.exception("media_processing_failed media_id=%s", media_id)
