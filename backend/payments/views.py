
import uuid

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from fees.models import Installment
from .models import Payment, Receipt
from .serializers import MockPaymentSerializer
from reminders.services import stop_pending_reminders


class MockPaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != "PARENT":
            return Response(
                {"error": "Parent access required."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = MockPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        key = data["idempotency_key"]

        # Return the original result for a repeated request.
        existing = Payment.objects.filter(
            idempotency_key=key
        ).first()

        if existing:
            if existing.installment.fee_plan.student.parent_id != request.user.id:
                return Response(
                    {"error": "Invalid payment request."},
                    status=status.HTTP_403_FORBIDDEN
                )

            return Response({
                "message": "Payment request already processed.",
                "reference_id": existing.reference_id,
                "status": existing.status,
                "amount": str(existing.amount),
            })

        with transaction.atomic():

            installment = get_object_or_404(
                Installment.objects.select_for_update(),
                id=data["installment_id"],
                fee_plan__student__parent=request.user,
                fee_plan__student__active=True
            )

            # Lock the fee plan as well, so sibling instalments
            # cannot be paid concurrently beyond the plan balance.
            fee_plan = type(installment.fee_plan).objects.select_for_update().get(
                pk=installment.fee_plan_id
            )

            if data["amount"] > installment.balance:
                return Response(
                    {"error": "Payment exceeds outstanding balance."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            payment_status = (
                Payment.Status.SUCCESS
                if data["simulate_success"]
                else Payment.Status.FAILED
            )

            payment = Payment.objects.create(
                installment=installment,
                amount=data["amount"],
                reference_id=f"MOCK-{uuid.uuid4().hex[:12].upper()}",
                idempotency_key=key,
                status=payment_status
            )

            if payment_status == Payment.Status.SUCCESS:

                installment.paid_amount += data["amount"]
                installment.update_status()

                installment.save(
                    update_fields=["paid_amount", "status"]
                )

                # Stop pending reminders only when fully paid.
                if installment.status == Installment.Status.PAID:
                    stop_pending_reminders(installment)

                Receipt.objects.create(
                    payment=payment,
                    receipt_number=(
                        f"EDU-{uuid.uuid4().hex[:10].upper()}"
                    )
                )

        return Response({
            "message": (
                "Payment successful."
                if payment_status == Payment.Status.SUCCESS
                else "Payment failed. No balance was changed."
            ),
            "reference_id": payment.reference_id,
            "status": payment.status,
            "amount": str(payment.amount),
            "receipt_number": (
                payment.receipt.receipt_number
                if payment_status == Payment.Status.SUCCESS
                else None
            ),
            "remaining_balance": str(
                installment.balance
            ),
        }, status=status.HTTP_201_CREATED)
