from rest_framework import serializers

from accounts.models import User
from .models import Student, Centre, Batch


class CentreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Centre
        fields = ["id", "name", "location"]


class BatchSerializer(serializers.ModelSerializer):
    centre_name = serializers.CharField(
        source="centre.name",
        read_only=True
    )

    class Meta:
        model = Batch
        fields = ["id", "name", "centre", "centre_name"]


class StudentSerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(
        source="parent.username",
        read_only=True
    )

    batch_name = serializers.CharField(
        source="batch.name",
        read_only=True
    )

    class Meta:
        model = Student
        fields = [
            "id",
            "student_id",
            "name",
            "parent",
            "parent_name",
            "batch",
            "batch_name",
            "attendance_percentage",
            "active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_parent(self, value):
        if value.role != "PARENT":
            raise serializers.ValidationError(
                "Selected user is not a parent."
            )
        return value

    def validate_attendance_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Attendance must be between 0 and 100."
            )
        return value