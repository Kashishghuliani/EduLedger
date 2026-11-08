
from rest_framework import serializers
from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="installment.fee_plan.student.name",
        read_only=True
    )

    balance = serializers.ReadOnlyField(
        source="installment.balance"
    )

    class Meta:
        model = Reminder
        fields = [
            "id",
            "student_name",
            "message",
            "message_type",
            "language",
            "scheduled_for",
            "status",
            "balance",
        ]
