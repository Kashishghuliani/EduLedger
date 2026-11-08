
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.core.management import call_command
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Reminder
from .serializers import ReminderSerializer


class ReminderListView(generics.ListAPIView):

    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        queryset = Reminder.objects.select_related(
            "installment__fee_plan__student"
        )

        if user.role == "ACCOUNTS":
            return queryset.order_by("-created_at")

        if user.role == "PARENT":
            return queryset.filter(
                installment__fee_plan__student__parent=user,
                installment__fee_plan__student__active=True
            ).order_by("-created_at")

        return queryset.none()


class GenerateRemindersView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != "ACCOUNTS":
            return Response(
                {"error": "Only accounts executives can generate reminders."},
                status=status.HTTP_403_FORBIDDEN
            )

        from io import StringIO

        output = StringIO()

        try:
            call_command("send_reminders", stdout=output)

            return Response(
                {
                    "message": "Reminder generation completed successfully.",
                    "details": output.getvalue()
                },
                status=status.HTTP_200_OK
            )

        except Exception as error:
            return Response(
                {
                    "error": "Reminder generation failed.",
                    "details": str(error)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


