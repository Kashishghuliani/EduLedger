from django.db import models
from fees.models import Installment


class Reminder(models.Model):

    class Language(models.TextChoices):
        ENGLISH = "EN", "English"
        HINDI = "HI", "Hindi"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SENT = "SENT", "Sent"
        SKIPPED = "SKIPPED", "Skipped"

    class MessageType(models.TextChoices):
            BEFORE = "BEFORE", "Before due date"
            DUE = "DUE", "Due date"
            AFTER = "AFTER", "After due date"

    installment = models.ForeignKey(
        Installment,
        on_delete=models.PROTECT,
        related_name="reminders"
    )

    scheduled_for = models.DateTimeField()

    language = models.CharField(
        max_length=2,
        choices=Language.choices,
        default=Language.ENGLISH
    )

    message = models.TextField()

    message_type = models.CharField(
        max_length=10,
        choices=MessageType.choices,
        default=MessageType.DUE
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)



