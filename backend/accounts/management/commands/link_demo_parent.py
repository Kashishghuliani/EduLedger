from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

from students.models import Student

User = get_user_model()


class Command(BaseCommand):
    help = "Link the demo parent account to the demo student"

    def handle(self, *args, **options):

        try:
            parent = User.objects.get(username="parent_aarav")
        except User.DoesNotExist:
            raise CommandError(
                "Demo parent not found. Run create_demo_accounts first."
            )

        try:
            student = Student.objects.get(student_id="STU001")
        except Student.DoesNotExist:
            raise CommandError(
                "Student STU001 not found. Create the student first."
            )

        student.parent = parent
        student.save(update_fields=["parent"])

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully linked {parent.username} "
                f"to {student.name} ({student.student_id})."
            )
        )