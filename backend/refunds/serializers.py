
from rest_framework import serializers
from .models import Refund
from students.models import Student
from fees.models import FeePlan


class RefundCreateSerializer(serializers.ModelSerializer):

    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all()
    )

    class Meta:
        model = Refund
        fields = [
            "id",
            "student",
            "course_start",
            "course_end",
            "withdrawal_date",
            "amount_paid",
            "refund_amount",
            "processing_deadline",
            "status",
        ]

        read_only_fields = [
            "amount_paid",
            "refund_amount",
            "processing_deadline",
            "status",
        ]

    def validate(self, data):

        if data["course_end"] <= data["course_start"]:
            raise serializers.ValidationError(
                "Course end date must be after start date."
            )

        if data["withdrawal_date"] < data["course_start"]:
            raise serializers.ValidationError(
                "Withdrawal date cannot precede course start."
            )

        return data

    def create(self, validated_data):

        from .services import calculate_pro_rata_refund

        student = validated_data["student"]

        fee_plan = FeePlan.objects.get(student=student)

        # Calculate from recorded successful payments,
        # not an amount supplied by the user.
        from django.db.models import Sum
        from payments.models import Payment

        amount_paid = (
            Payment.objects.filter(
                installment__fee_plan=fee_plan,
                status=Payment.Status.SUCCESS
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )

        result = calculate_pro_rata_refund(
            amount_paid=amount_paid,
            course_start=validated_data["course_start"],
            course_end=validated_data["course_end"],
            withdrawal_date=validated_data["withdrawal_date"],
        )

        return Refund.objects.create(
            **validated_data,
            amount_paid=result["amount_paid"],
            refund_amount=result["refund_amount"],
            processing_deadline=result["processing_deadline"],
        )
