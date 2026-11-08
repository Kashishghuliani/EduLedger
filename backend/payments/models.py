from django.db import models
from fees.models import Installment


class Payment(models.Model):

    class Status(models.TextChoices):
        SUCCESS = "SUCCESS", "Successful"
        FAILED = "FAILED", "Failed"

    installment = models.ForeignKey(
        Installment,
        on_delete=models.PROTECT,
        related_name="payments"
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    reference_id = models.CharField(
        max_length=100,
        unique=True
    )

    idempotency_key = models.CharField(
        max_length=100,
        unique=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.reference_id


class Receipt(models.Model):

    payment = models.OneToOneField(
        Payment,
        on_delete=models.PROTECT,
        related_name="receipt"
    )

    receipt_number = models.CharField(
        max_length=50,
        unique=True
    )

    created_at = models.DateTimeField(auto_now_add=True)