from django.db import models
from students.models import Student


class Refund(models.Model):

    class Status(models.TextChoices):
        CALCULATED = "CALCULATED", "Calculated"
        APPROVED = "APPROVED", "Approved"
        PROCESSED = "PROCESSED", "Processed"

    student = models.ForeignKey(
        Student,
        on_delete=models.PROTECT,
        related_name="refunds"
    )

    course_start = models.DateField()
    course_end = models.DateField()
    withdrawal_date = models.DateField()

    amount_paid = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    refund_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    processing_deadline = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CALCULATED
    )

    created_at = models.DateTimeField(auto_now_add=True)