from decimal import Decimal
from datetime import date

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone

from students.models import Centre, Batch, Student
from fees.models import FeePlan, Installment
from payments.models import Payment, Receipt


class Command(BaseCommand):
    help = "Create EduLedger client sample demo data"

    @transaction.atomic
    def handle(self, *args, **options):

        User = get_user_model()

        # 1. Create centre
        centre, _ = Centre.objects.get_or_create(
            name="Jaipur Main Centre",
            defaults={"location": "Jaipur"}
        )

        # 2. Create Accounts Executive account
        admin, _ = User.objects.get_or_create(
            username="admin_demo",
            defaults={
                "first_name": "Demo Accounts Executive",
                "email": "admin_demo@eduledger.local",
                "role": User.Role.ACCOUNTS,
                "phone": "9876543210",
                "preferred_language": "EN",
            }
        )

        admin.first_name = "Demo Accounts Executive"
        admin.email = "admin_demo@eduledger.local"
        admin.role = User.Role.ACCOUNTS
        admin.phone = "9876543210"
        admin.preferred_language = "EN"
        admin.set_password("Admin@12345")
        admin.save()

        # 3. Create parent accounts
        parent_data = [
            {
                "username": "parent_aarav",
                "name": "Aarav Meena",
                "email": "parent_aarav@eduledger.local",
                "password": "Parent@123",
                "phone": "9876543211",
            },
            {
                "username": "parent_ishita",
                "name": "Ishita Sharma",
                "email": "parent_ishita@eduledger.local",
                "password": "Parent@123",
                "phone": "9876543212",
            },
            {
                "username": "parent_mohit",
                "name": "Mohit Gurjar",
                "email": "parent_mohit@eduledger.local",
                "password": "Parent@123",
                "phone": "9876543213",
            },
        ]

        parents = {}

        for item in parent_data:
            parent, _ = User.objects.get_or_create(
                username=item["username"],
                defaults={
                    "first_name": item["name"],
                    "email": item["email"],
                    "role": User.Role.PARENT,
                    "preferred_language": "EN",
                    "phone": item["phone"],
                }
            )

            parent.first_name = item["name"]
            parent.email = item["email"]
            parent.role = User.Role.PARENT
            parent.preferred_language = "EN"
            parent.phone = item["phone"]
            parent.set_password(item["password"])
            parent.save()

            parents[item["username"]] = parent

        # 4. Client-provided sample records
        sample_data = [
            {
                "student_id": "STU-0412",
                "name": "Aarav Meena",
                "parent": "parent_aarav",
                "batch": "JEE 2027 Morning",
                "amount": Decimal("30000.00"),
                "paid": Decimal("30000.00"),
                "due_date": date(2026, 10, 10),
                "reference": "DEMO-PAY-STU0412",
                "idempotency": "DEMO-IDEM-STU0412",
                "receipt": "RCP-STU0412-001",
            },
            {
                "student_id": "STU-0587",
                "name": "Ishita Sharma",
                "parent": "parent_ishita",
                "batch": "JEE 2027 Evening",
                "amount": Decimal("30000.00"),
                "paid": Decimal("15000.00"),
                "due_date": date(2026, 10, 10),
                "reference": "DEMO-PAY-STU0587",
                "idempotency": "DEMO-IDEM-STU0587",
                "receipt": "RCP-STU0587-001",
            },
            {
                "student_id": "STU-0219",
                "name": "Mohit Gurjar",
                "parent": "parent_mohit",
                "batch": "NEET 2027 Morning",
                "amount": Decimal("40000.00"),
                "paid": Decimal("0.00"),
                "due_date": date(2026, 11, 15),
                "reference": None,
                "idempotency": None,
                "receipt": None,
            },
        ]

        for item in sample_data:

            # 5. Create batch
            batch, _ = Batch.objects.get_or_create(
                name=item["batch"],
                centre=centre
            )

            # 6. Create or update student
            student, _ = Student.objects.update_or_create(
                student_id=item["student_id"],
                defaults={
                    "name": item["name"],
                    "parent": parents[item["parent"]],
                    "batch": batch,
                    "active": True,
                }
            )

            # 7. Create or update fee plan
            fee_plan, _ = FeePlan.objects.update_or_create(
                student=student,
                defaults={
                    "total_fee": item["amount"],
                    "discount": Decimal("0.00"),
                }
            )

            # 8. Create or update instalment
            installment, created = Installment.objects.get_or_create(
                fee_plan=fee_plan,
                amount=item["amount"],
                due_date=item["due_date"],
                defaults={
                    "paid_amount": item["paid"],
                    "status": Installment.Status.PENDING,
                }
            )

            if not created:
                installment.paid_amount = item["paid"]

            installment.update_status()
            installment.save()

            # 9. Create successful payment and receipt
            if item["paid"] > 0:

                payment, _ = Payment.objects.update_or_create(
                    reference_id=item["reference"],
                    defaults={
                        "installment": installment,
                        "amount": item["paid"],
                        "idempotency_key": item["idempotency"],
                        "status": Payment.Status.SUCCESS,
                    }
                )

                Receipt.objects.get_or_create(
                    payment=payment,
                    defaults={
                        "receipt_number": item["receipt"],
                    }
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Created/updated {item['student_id']} - {item['name']}"
                )
            )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS("Client demo data seeded successfully.")
        )
        self.stdout.write(f"Current date: {timezone.localdate()}")
        self.stdout.write("Centre: Jaipur Main Centre")
        self.stdout.write("Accounts login: admin_demo")
        self.stdout.write("Parent password: Parent@123")