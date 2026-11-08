from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Create or update EduLedger demo accounts"

    def handle(self, *args, **options):

        demo_accounts = [
            {
                "username": "admin_demo",
                "password": "Admin@12345",
                "first_name": "Demo Accounts Executive",
                "email": "admin_demo@eduledger.local",
                "role": "ACCOUNTS",
            },
            {
                "username": "parent_aarav",
                "password": "Parent@123",
                "first_name": "Demo Parent",
                "email": "parent_aarav@eduledger.local",
                "role": "PARENT",
            },
        ]

        for account in demo_accounts:
            user, created = User.objects.get_or_create(
                username=account["username"],
                defaults={
                    "first_name": account["first_name"],
                    "email": account["email"],
                    "role": account["role"],
                },
            )

            # Set the demo account details and password.
            user.first_name = account["first_name"]
            user.email = account["email"]
            user.role = account["role"]
            user.set_password(account["password"])
            user.save()

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'{account["username"]} created successfully.'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f'{account["username"]} already existed. Demo details updated.'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS("Demo accounts setup completed!")
        )
