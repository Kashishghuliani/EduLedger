from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        PARENT = "PARENT", "Parent"
        ACCOUNTS = "ACCOUNTS", "Accounts Executive"

    role = models.CharField(
        max_length=20,
        choices=Role.choices
    )

    phone = models.CharField(
        max_length=15,
        unique=True,
        null=True,
        blank=True
    )

    preferred_language = models.CharField(
        max_length=2,
        choices=[
            ("EN", "English"),
            ("HI", "Hindi"),
        ],
        default="EN"
    )

    def __str__(self):
        return f"{self.username} ({self.role})"