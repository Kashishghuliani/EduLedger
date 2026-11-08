from django.db import models
from students.models import Student


class RiskAssessment(models.Model):

    class RiskLevel(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    student = models.ForeignKey(
        Student,
        on_delete=models.PROTECT,
        related_name="risk_assessments"
    )

    score = models.PositiveSmallIntegerField()

    level = models.CharField(
        max_length=10,
        choices=RiskLevel.choices
    )

    reasons = models.JSONField(default=list)

    is_false_positive = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)


class CounsellorTask(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.PROTECT,
        related_name="counsellor_tasks"
    )

    assessment = models.ForeignKey(
        RiskAssessment,
        on_delete=models.PROTECT
    )

    description = models.TextField()

    completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)