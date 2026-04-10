from celery import shared_task
from .models import MediaFile
import time
import os

@shared_task
def process_media_file(media_id):
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

    except MediaFile.DoesNotExist:
        pass