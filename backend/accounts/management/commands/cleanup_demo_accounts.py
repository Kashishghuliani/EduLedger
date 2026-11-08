from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.db.models import Q
from django.contrib.auth import get_user_model

from students.models import Student, TestScore
from fees.models import FeePlan, Installment
from payments.models import Payment, Receipt
from reminders.models import Reminder
from refunds.models import Refund
from risk.models import RiskAssessment, CounsellorTask

User = get_user_model()


class Command(BaseCommand):
    help = "Remove Sanjay and parent1 demo accounts and their associated data"

    @transaction.atomic
    def handle(self, *args, **options):

        usernames = ["Sanjay", "parent1"]

        parents = User.objects.filter(username__in=usernames)

        if parents.count() != 2:
            raise CommandError(
                "Expected both Sanjay and parent1 to exist. "
                "No records were deleted."
            )

        students = Student.objects.filter(parent__in=parents)
        student_ids = list(students.values_list("id", flat=True))

        self.stdout.write("Students to be deleted:")

        for student in students:
            self.stdout.write(
                f"- {student.name} ({student.student_id})"
            )

        # Find related fee records.
        fee_plan_ids = list(
            FeePlan.objects.filter(
                student_id__in=student_ids
            ).values_list("id", flat=True)
        )

        installment_ids = list(
            Installment.objects.filter(
                fee_plan_id__in=fee_plan_ids
            ).values_list("id", flat=True)
        )

        payment_ids = list(
            Payment.objects.filter(
                installment_id__in=installment_ids
            ).values_list("id", flat=True)
        )

        assessment_ids = list(
            RiskAssessment.objects.filter(
                student_id__in=student_ids
            ).values_list("id", flat=True)
        )

        # Delete related records in dependency order.

        CounsellorTask.objects.filter(
            Q(student_id__in=student_ids)
            | Q(assessment_id__in=assessment_ids)
        ).delete()

        RiskAssessment.objects.filter(
            id__in=assessment_ids
        ).delete()

        Reminder.objects.filter(
            installment_id__in=installment_ids
        ).delete()

        Receipt.objects.filter(
            payment_id__in=payment_ids
        ).delete()

        Payment.objects.filter(
            id__in=payment_ids
        ).delete()

        Installment.objects.filter(
            id__in=installment_ids
        ).delete()

        FeePlan.objects.filter(
            id__in=fee_plan_ids
        ).delete()

        Refund.objects.filter(
            student_id__in=student_ids
        ).delete()

        TestScore.objects.filter(
            student_id__in=student_ids
        ).delete()

        students.delete()
        parents.delete()

        self.stdout.write(
            self.style.SUCCESS(
                "Sanjay and parent1 and their associated records "
                "have been deleted successfully."
            )
        )