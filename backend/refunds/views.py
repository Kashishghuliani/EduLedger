
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Refund
from .serializers import RefundCreateSerializer


class RefundCreateView(generics.CreateAPIView):

    serializer_class = RefundCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):

        if request.user.role != "ACCOUNTS":
            raise PermissionDenied(
                "Only accounts executives can calculate refunds."
            )

        return super().create(request, *args, **kwargs)


class RefundListView(generics.ListAPIView):

    serializer_class = RefundCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        if self.request.user.role != "ACCOUNTS":
            raise PermissionDenied(
                "Only accounts executives can view refunds."
            )

        return Refund.objects.select_related(
            "student"
        ).order_by("-created_at")
