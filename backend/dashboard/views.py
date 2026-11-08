
from decimal import Decimal

from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from fees.models import Installment
from students.models import Student
from risk.models import CounsellorTask


class AccountsDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "ACCOUNTS":
            raise PermissionDenied(
                "Accounts executive access required."
            )

        today = timezone.localdate()

        installments = Installment.objects.select_related(
            "fee_plan__student__batch__centre"
        )

        outstanding_expression = ExpressionWrapper(
            F("amount") - F("paid_amount"),
            output_field=DecimalField(
                max_digits=12,
                decimal_places=2
            )
        )

        totals = installments.aggregate(
            billed=Sum("amount"),
            collected=Sum("paid_amount"),
            outstanding=Sum(outstanding_expression),
        )

        billed = totals["billed"] or Decimal("0.00")
        collected = totals["collected"] or Decimal("0.00")
        outstanding = totals["outstanding"] or Decimal("0.00")

        overdue = installments.filter(
            due_date__lt=today,
            status__in=["PENDING", "PARTIAL"]
        )

        overdue_amount = overdue.aggregate(
            total=Sum(outstanding_expression)
        )["total"] or Decimal("0.00")

        # Ageing analysis
        ageing = {
            "0_30_days": Decimal("0.00"),
            "31_60_days": Decimal("0.00"),
            "61_90_days": Decimal("0.00"),
            "90_plus_days": Decimal("0.00"),
        }

        for item in overdue:
            days = (today - item.due_date).days
            balance = item.balance

            if days <= 30:
                ageing["0_30_days"] += balance
            elif days <= 60:
                ageing["31_60_days"] += balance
            elif days <= 90:
                ageing["61_90_days"] += balance
            else:
                ageing["90_plus_days"] += balance

        # Centre-wise breakdown
        centre_data = installments.values(
            "fee_plan__student__batch__centre__name"
        ).annotate(
            billed=Sum("amount"),
            collected=Sum("paid_amount"),
            outstanding=Sum(outstanding_expression)
        )

        # Batch-wise breakdown
        batch_data = installments.values(
            "fee_plan__student__batch__name"
        ).annotate(
            billed=Sum("amount"),
            collected=Sum("paid_amount"),
            outstanding=Sum(outstanding_expression)
        )

        high_risk_tasks = CounsellorTask.objects.filter(
            completed=False
        ).count()

        return Response({

            "summary": {
                "total_students": Student.objects.filter(
                    active=True
                ).count(),

                "total_billed": str(billed),
                "total_collected": str(collected),
                "total_outstanding": str(outstanding),
                "overdue_amount": str(overdue_amount),

                "collection_percentage": str(
                    round(
                        float(collected / billed * 100), 2
                    ) if billed else 0
                ),

                "pending_counsellor_tasks": high_risk_tasks,
            },

            "ageing": {
                key: str(value)
                for key, value in ageing.items()
            },

            "centre_wise": [
                {
                    "centre": item[
                        "fee_plan__student__batch__centre__name"
                    ],
                    "billed": str(item["billed"] or 0),
                    "collected": str(item["collected"] or 0),
                    "outstanding": str(item["outstanding"] or 0),
                }
                for item in centre_data
            ],

            "batch_wise": [
                {
                    "batch": item[
                        "fee_plan__student__batch__name"
                    ],
                    "billed": str(item["billed"] or 0),
                    "collected": str(item["collected"] or 0),
                    "outstanding": str(item["outstanding"] or 0),
                }
                for item in batch_data
            ]
        })
