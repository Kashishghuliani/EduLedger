
from django.urls import path

from .views import (
    AssessStudentRiskView,
    RiskAssessmentListView,
    FalsePositiveView,
    CounsellorTaskListView
)

urlpatterns = [
    path(
        "assess/<int:student_id>/",
        AssessStudentRiskView.as_view()
    ),
    path(
        "assessments/",
        RiskAssessmentListView.as_view()
    ),
    path(
        "false-positive/<int:assessment_id>/",
        FalsePositiveView.as_view()
    ),
    path(
        "tasks/",
        CounsellorTaskListView.as_view()
    ),
]
