
from rest_framework import serializers
from decimal import Decimal


class MockPaymentSerializer(serializers.Serializer):

    installment_id = serializers.IntegerField()

    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=Decimal("0.01")
    )

    idempotency_key = serializers.CharField(
        max_length=100
    )

    simulate_success = serializers.BooleanField(
        default=True
    )
