from django.db import models
from django.db.models import Sum
from django.conf import settings
from students.models import Student
from decimal import Decimal


class FeePlan(models.Model):

    student = models.OneToOneField(
        Student,
        on_delete=models.PROTECT,
        related_name="fee_plan"
    )

    total_fee = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    discount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def payable_amount(self):
        return self.total_fee - self.discount

    @property
    def total_paid(self):
        return self.installments.aggregate(
            total=Sum("paid_amount")
        )["total"] or Decimal("0.00")

    @property
    def outstanding(self):
        return self.payable_amount - self.total_paid

    def __str__(self):
        return self.student.name



class Installment(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PARTIAL = "PARTIAL", "Partially Paid"
        PAID = "PAID", "Paid"

    fee_plan = models.ForeignKey(
        FeePlan,
        on_delete=models.PROTECT,
        related_name="installments"
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    paid_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    due_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    def update_status(self):
        if self.paid_amount >= self.amount:
            self.status = self.Status.PAID
        elif self.paid_amount > 0:
            self.status = self.Status.PARTIAL
        else:
            self.status = self.Status.PENDING

    @property
    def balance(self):
        return max(self.amount - self.paid_amount, Decimal("0.00"))

    @property
    def days_overdue(self):
        from django.utils import timezone

        if self.balance <= 0:
            return 0

        today = timezone.localdate()

        return max(0, (today - self.due_date).days)

    @property
    def display_status(self):
        if self.balance <= 0:
            return self.Status.PAID

        if self.days_overdue > 0:
            return "OVERDUE"

        if self.paid_amount > 0:
            return self.Status.PARTIAL

        return self.Status.PENDING

    def __str__(self):
        return f"{self.fee_plan.student.name} - {self.amount}"
