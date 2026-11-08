
from datetime import timedelta
from django.utils import timezone

from fees.models import Installment
from students.models import Student
from .models import RiskAssessment, CounsellorTask


def calculate_dropout_risk(student):

    today = timezone.localdate()

    score = 0
    reasons = []

    # 1. Check overdue instalments.
    overdue_installments = Installment.objects.filter(
        fee_plan__student=student,
        due_date__lt=today - timedelta(days=30),
        status__in=["PENDING", "PARTIAL"]
    )

    overdue_count = overdue_installments.count()

    if overdue_count >= 1:
        score += 35
        reasons.append(
            "One or more instalments overdue by more than 30 days."
        )

    # 2. Check attendance.
    if student.attendance_percentage < 60:
        score += 30
        reasons.append(
            "Attendance is below 60%."
        )

    # 3. Check recent test score trends.
    scores = list(
        student.test_scores.order_by("-test_date")[:3]
    )

    if len(scores) == 3:

        latest = float(scores[0].score / scores[0].maximum_score * 100)
        previous = float(scores[1].score / scores[1].maximum_score * 100)
        oldest = float(scores[2].score / scores[2].maximum_score * 100)

        if latest < previous < oldest:
            score += 25
            reasons.append(
                "Test performance has declined across three tests."
            )

    # 4. Check multiple overdue instalments.
    if overdue_count >= 2:
        score += 10
        reasons.append(
            "Multiple instalments are overdue."
        )

    score = min(score, 100)

    if score >= 60:
        level = RiskAssessment.RiskLevel.HIGH
    elif score >= 30:
        level = RiskAssessment.RiskLevel.MEDIUM
    else:
        level = RiskAssessment.RiskLevel.LOW

    return score, level, reasons


def assess_student_risk(student):

    score, level, reasons = calculate_dropout_risk(student)

    assessment = RiskAssessment.objects.create(
        student=student,
        score=score,
        level=level,
        reasons=reasons
    )

    # Only high-risk cases create counsellor tasks.
    if level == RiskAssessment.RiskLevel.HIGH:

        CounsellorTask.objects.create(
            student=student,
            assessment=assessment,
            description=(
                "Contact the student/parent for a "
                "supportive counselling follow-up."
            )
        )

    return assessment
