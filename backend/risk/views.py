
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import status

from students.models import Student
from .models import RiskAssessment, CounsellorTask
from .serializers import (
    RiskAssessmentSerializer,
    CounsellorTaskSerializer
)
from .services import assess_student_risk
from django.shortcuts import get_object_or_404


def require_accounts(user):
    if user.role != "ACCOUNTS":
        raise PermissionDenied(
            "Only accounts executives can access risk assessments."
        )


class AssessStudentRiskView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, student_id):

        require_accounts(request.user)

        student = get_object_or_404(
            Student,
            id=student_id,
            active=True
        )

        assessment = assess_student_risk(student)

        return Response(
            RiskAssessmentSerializer(assessment).data,
            status=status.HTTP_201_CREATED
        )


class RiskAssessmentListView(generics.ListAPIView):

    serializer_class = RiskAssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        require_accounts(self.request.user)

        return RiskAssessment.objects.select_related(
            "student"
        ).order_by("-created_at")


class FalsePositiveView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, assessment_id):

        require_accounts(request.user)

        assessment = get_object_or_404(
            RiskAssessment,
            id=assessment_id
        )

        assessment.is_false_positive = True
        assessment.save(update_fields=["is_false_positive"])

        # Close open tasks associated with this assessment.
        CounsellorTask.objects.filter(
            assessment=assessment,
            completed=False
        ).update(completed=True)

        return Response({
            "message": "False positive recorded.",
            "assessment_id": assessment.id
        })


class CounsellorTaskListView(generics.ListAPIView):

    serializer_class = CounsellorTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        require_accounts(self.request.user)

        return CounsellorTask.objects.select_related(
            "student"
        ).order_by("completed", "-created_at")
