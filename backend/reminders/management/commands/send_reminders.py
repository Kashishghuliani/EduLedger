
from django.core.management.base import BaseCommand
from django.utils import timezone

from fees.models import Installment
from reminders.models import Reminder


class Command(BaseCommand):
    help = "Generate fee reminders for upcoming and overdue installments"

    def handle(self, *args, **options):
        today = timezone.localdate()

        reminder_rules = {
            3: Reminder.MessageType.BEFORE,
            0: Reminder.MessageType.DUE,
            -3: Reminder.MessageType.AFTER,
        }

        created_count = 0
        skipped_count = 0

        installments = Installment.objects.select_related(
            "fee_plan__student__parent"
        ).filter(
            status__in=[
                Installment.Status.PENDING,
                Installment.Status.PARTIAL,
            ]
        )

        for installment in installments:
            days_until_due = (installment.due_date - today).days

            message_type = reminder_rules.get(days_until_due)

            if not message_type:
                continue

            # Prevent duplicate reminders for the same installment and type.
            already_exists = Reminder.objects.filter(
                installment=installment,
                message_type=message_type,
            ).exists()

            if already_exists:
                skipped_count += 1
                continue

            student = installment.fee_plan.student
            parent = student.parent

            language = (
                Reminder.Language.HINDI
                if parent.preferred_language == "HI"
                else Reminder.Language.ENGLISH
            )

            if language == Reminder.Language.HINDI:
                messages = {
                    Reminder.MessageType.BEFORE:
                        f"नमस्ते, {student.name} की फीस की किस्त "
                        f"{installment.due_date} को देय है। कृपया समय पर भुगतान करें।",

                    Reminder.MessageType.DUE:
                        f"नमस्ते, {student.name} की फीस की किस्त "
                        f"आज देय है। कृपया भुगतान करें।",

                    Reminder.MessageType.AFTER:
                        f"नमस्ते, {student.name} की फीस की किस्त "
                        f"की देय तिथि निकल चुकी है। कृपया बकाया भुगतान करें।",
                }
            else:
                messages = {
                    Reminder.MessageType.BEFORE:
                        f"Hello, the fee installment for {student.name} "
                        f"is due on {installment.due_date}. Please pay on time.",

                    Reminder.MessageType.DUE:
                        f"Hello, the fee installment for {student.name} "
                        f"is due today. Please complete the payment.",

                    Reminder.MessageType.AFTER:
                        f"Hello, the fee installment for {student.name} "
                        f"is overdue. Please clear the outstanding payment.",
                }

            Reminder.objects.create(
                installment=installment,
                scheduled_for=timezone.now(),
                language=language,
                message=messages[message_type],
                message_type=message_type,
                status=Reminder.Status.PENDING,
            )

            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Reminder generation completed. "
                f"Created: {created_count}, "
                f"Skipped duplicates: {skipped_count}"
            )
        )
