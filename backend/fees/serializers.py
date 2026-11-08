
from rest_framework import serializers
from django.db import transaction
from decimal import Decimal

from .models import FeePlan, Installment


class InstallmentInputSerializer(serializers.Serializer):

    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=Decimal("0.01")
    )

    due_date = serializers.DateField()


class FeePlanCreateSerializer(serializers.ModelSerializer):

    installments = InstallmentInputSerializer(
        many=True,
        write_only=True
    )

    class Meta:
        model = FeePlan
        fields = [
            "id",
            "student",
            "total_fee",
            "discount",
            "installments",
        ]

    def validate(self, data):

        total_fee = data["total_fee"]
        discount = data.get("discount", Decimal("0.00"))

        if discount < 0 or discount >= total_fee:
            raise serializers.ValidationError(
                "Discount must be non-negative and less than total fee."
            )

        payable = total_fee - discount
        installments = data["installments"]

        if not installments:
            raise serializers.ValidationError(
                "At least one installment is required."
            )

        installment_total = sum(
            (item["amount"] for item in installments),
            Decimal("0.00")
        )

        if installment_total != payable:
            raise serializers.ValidationError(
                f"Installments must total ₹{payable}."
            )

        return data

    @transaction.atomic
    def create(self, validated_data):

        installments_data = validated_data.pop("installments")

        fee_plan = FeePlan.objects.create(**validated_data)

        for item in installments_data:
            Installment.objects.create(
                fee_plan=fee_plan,
                amount=item["amount"],
                due_date=item["due_date"]
            )

        return fee_plan


# -------------------------------
# FEE LEDGER SERIALIZERS
# -------------------------------


class InstallmentLedgerSerializer(serializers.ModelSerializer):

    balance = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    days_overdue = serializers.IntegerField(read_only=True)

    display_status = serializers.CharField(read_only=True)

    class Meta:
        model = Installment
        fields = [
            "id",
            "amount",
            "paid_amount",
            "balance",
            "due_date",
            "status",
            "display_status",
            "days_overdue",
        ]


class FeeLedgerSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.name",
        read_only=True
    )

    installments = InstallmentLedgerSerializer(
        many=True,
        read_only=True
    )

    total_paid = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    outstanding = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = FeePlan
        fields = [
            "id",
            "student",
            "student_name",
            "total_fee",
            "discount",
            "payable_amount",
            "total_paid",
            "outstanding",
            "installments",
        ]
