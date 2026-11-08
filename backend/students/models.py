from django.conf import settings
from django.db import models


class Centre(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=150)

    def __str__(self):
        return self.name


class Batch(models.Model):
    name = models.CharField(max_length=100)
    centre = models.ForeignKey(
        Centre,
        on_delete=models.PROTECT,
        related_name="batches"
    )

    def __str__(self):
        return self.name


class Student(models.Model):

    student_id = models.CharField(
        max_length=20,
        unique=True
    )

    name = models.CharField(max_length=100)

    parent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="children"
    )

    batch = models.ForeignKey(
        Batch,
        on_delete=models.PROTECT,
        related_name="students"
    )

    attendance_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100
    )

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_id} - {self.name}"



class TestScore(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.PROTECT,
        related_name="test_scores"
    )

    subject = models.CharField(max_length=100)

    score = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    maximum_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100
    )

    test_date = models.DateField()

    def __str__(self):
        return f"{self.student.name} - {self.subject}"
