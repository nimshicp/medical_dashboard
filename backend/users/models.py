from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("doctor", "Doctor"),
    )

    email = models.EmailField(unique=True, db_index=True)
    username = models.CharField(max_length=150)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="doctor")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    
    
    def __str__(self):
        return self.username