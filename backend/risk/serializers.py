
from rest_framework import serializers
from .models import RiskAssessment, CounsellorTask


class RiskAssessmentSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.name",
        read_only=True
    )

    student_id = serializers.CharField(
        source="student.student_id",
        read_only=True
    )

    class Meta:
        model = RiskAssessment
        fields = [
            "id",
            "student_name",
            "student_id",
            "score",
            "level",
            "reasons",
            "is_false_positive",
            "created_at",
        ]


class CounsellorTaskSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.name",
        read_only=True
    )

    class Meta:
        model = CounsellorTask
        fields = [
            "id",
            "student_name",
            "description",
            "completed",
            "created_at",
        ]
