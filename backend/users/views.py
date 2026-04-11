from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, DoctorListSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.conf import settings
from .models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.core.mail import BadHeaderError



class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        try:
            send_mail(
                "Welcome",
                f"Hi {user.username}, your account was created successfully!",
                getattr(settings, "DEFAULT_FROM_EMAIL", "nimshicp2003@gmail.com"),
                [user.email],
                fail_silently=True,
            )
        except Exception:
            pass

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response(
            {
                "access": access_token,
                "id": user.id,
                "username": user.username,
                "role": user.role,
            },
            status=status.HTTP_200_OK,
        )

        
        response.set_cookie(
            key=settings.JWT_COOKIE_NAME,
            value=str(refresh),
            max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            httponly=settings.JWT_COOKIE_HTTP_ONLY,
            secure=settings.JWT_COOKIE_SECURE,
            samesite=settings.JWT_COOKIE_SAMESITE,
            path=settings.JWT_COOKIE_PATH,
        )

        return response


class RefreshTokenAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        refresh_token = request.COOKIES.get(settings.JWT_COOKIE_NAME)

        if not refresh_token:
            return Response(
                {"error": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            return Response({"access": access_token})

        except TokenError:
            return Response(
                {"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"message": "Logged out successfully"})
        response.delete_cookie(
            settings.JWT_COOKIE_NAME,
            path=settings.JWT_COOKIE_PATH,
            samesite=settings.JWT_COOKIE_SAMESITE,
        )
        return response


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "email": request.user.email,
                "username": request.user.username,
                "role": request.user.role,
                "is_staff": request.user.is_staff,
            }
        )




# class GoogleLoginAPIView(APIView):
#     def post(self, request):
#         token = request.data.get("token")

#         try:
#             idinfo = id_token.verify_oauth2_token(
#                 token,
#                 requests.Request(),
#                 settings.GOOGLE_CLIENT_ID
#             )

#             email = idinfo["email"]
#             name = idinfo.get("name", "")

#             user, created = User.objects.get_or_create(
#                 email=email,
#                 defaults={"username":name}
#             )

#             refresh = RefreshToken.for_user(user)

#             return Response({
#                 "access": str(refresh.access_token),
#                 "refresh": str(refresh),
#                 "user": {
#                     "id": user.id,
#                     "email": user.email,
#                     "username": user.username,
#                     "role": user.role
#                 }
#             })

#         except Exception as e:
#             print("GOOGLE ERROR:", str(e))
#             return Response({"error": str(e)}, status=400)


class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        
        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.id))

        
        reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"

        
        print("RESET LINK:", reset_link)

        try:
            send_mail(
                subject="Password Reset",
                message=f"Click the link to reset your password:\n{reset_link}",
                from_email=settings.EMAIL_HOST_USER,   
                recipient_list=[email],
                fail_silently=False,
            )
        except BadHeaderError:
            return Response({"error": "Invalid email header"}, status=500)
        except Exception as e:
            return Response(
                {"error": f"Email failed: {str(e)}"},
                status=500
            )

        return Response({"message": "Reset link sent to your email"})


from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User


class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uid, token):
        password = request.data.get("password")

        if not password:
            return Response({"error": "Password is required"}, status=400)

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(id=user_id)
        except Exception:
            return Response({"error": "Invalid user"}, status=400)

        
        print("USER ID:", user_id)
        print("TOKEN RECEIVED:", token)


        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response(
                {"error": "Invalid or expired token"},
                status=400
            )

        # Set new password
        user.set_password(password)
        user.save()

        return Response({"message": "Password reset successful"})

class DoctorListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doctors = User.objects.filter(role="doctor").order_by("username")
        serializer = DoctorListSerializer(doctors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

