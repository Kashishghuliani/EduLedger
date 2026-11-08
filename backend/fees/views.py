
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import FeePlan
from .serializers import (
    FeePlanCreateSerializer,
    FeeLedgerSerializer,
)
from accounts.permissions import IsAccountsOrParent


class FeePlanCreateView(generics.CreateAPIView):
    """
    Only accounts executives can create fee plans.
    """

    serializer_class = FeePlanCreateSerializer
    permission_classes = [IsAuthenticated, IsAccountsOrParent]

    def create(self, request, *args, **kwargs):
        if request.user.role != "ACCOUNTS":
            raise PermissionDenied(
                "Only accounts executives can create fee plans."
            )

        return super().create(request, *args, **kwargs)


class StudentFeeLedgerView(generics.RetrieveAPIView):
    """
    Accounts executives can view any student's fee ledger.
    Parents can view only their own children's fee ledger.
    """

    serializer_class = FeeLedgerSerializer
    permission_classes = [IsAuthenticated, IsAccountsOrParent]

    def get_queryset(self):
        queryset = FeePlan.objects.select_related(
            "student",
            "student__parent",
            "student__batch",
        ).prefetch_related("installments")

        if self.request.user.role == "PARENT":
            queryset = queryset.filter(
                student__parent=self.request.user
            )

        elif self.request.user.role != "ACCOUNTS":
            queryset = queryset.none()

        return queryset
