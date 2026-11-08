
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from fees.models import Installment
from reminders.services import create_reminder


class Command(BaseCommand):

    help = "Generate scheduled fee reminders"

    def handle(self, *args, **kwargs):

        today = timezone.localdate()

        installments = Installment.objects.filter(
            status__in=["PENDING", "PARTIAL"]
        ).select_related(
            "fee_plan__student__parent"
        )

        generated = 0
        skipped = 0

        for installment in installments:

            # Ignore fully paid installments.
            if installment.status == "PAID":
                continue

            # Ignore installments with no outstanding balance.
            if installment.balance <= 0:
                continue

            # Determine reminder type.
            if installment.due_date == today + timedelta(days=3):
                reminder_type = "BEFORE"

            elif installment.due_date == today:
                reminder_type = "DUE"

            elif installment.due_date < today:
                reminder_type = "AFTER"

            else:
                # Not eligible for a reminder yet.
                continue

            # Get parent's preferred language.
            language = getattr(
                installment.fee_plan.student.parent,
                "preferred_language",
                "EN"
            ) or "EN"

            reminder = create_reminder(
                installment,
                language,
                reminder_type
            )

            if reminder:
                generated += 1

                self.stdout.write(
                    f"Reminder created for "
                    f"{installment.fee_plan.student.name} "
                    f"({reminder_type})"
                )

            else:
                skipped += 1

                self.stdout.write(
                    f"Reminder skipped for "
                    f"{installment.fee_plan.student.name} "
                    f"(already exists or not eligible)"
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Generated: {generated}, Skipped: {skipped}"
            )
        )
