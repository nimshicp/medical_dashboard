import logging
import time


logger = logging.getLogger("app")


class RequestLoggingMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        started_at = time.perf_counter()

        response = self.get_response(request)
        duration_ms = round((time.perf_counter() - started_at) * 1000, 2)
        user_id = getattr(getattr(request, "user", None), "id", None)

        logger.info(
            "request method=%s path=%s status=%s duration_ms=%s user_id=%s",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
            user_id,
        )
        return response
