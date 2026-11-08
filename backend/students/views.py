
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Student, Centre, Batch
from .serializers import StudentSerializer, CentreSerializer, BatchSerializer
from accounts.permissions import (
    IsAccountsExecutive,
    IsAccountsOrParent,
)


class StudentListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "ACCOUNTS":
            return Student.objects.select_related(
                "parent", "batch"
            ).all().order_by("-id")

        return Student.objects.select_related(
            "parent", "batch"
        ).filter(
            parent=user,
            active=True
        ).order_by("-id")

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsAccountsExecutive()]
        return super().get_permissions()

class CentreListCreateView(generics.ListCreateAPIView):
    queryset = Centre.objects.all().order_by("name")
    serializer_class = CentreSerializer
    permission_classes = [IsAuthenticated, IsAccountsExecutive]


class BatchListCreateView(generics.ListCreateAPIView):
    queryset = Batch.objects.select_related("centre").all().order_by("name")
    serializer_class = BatchSerializer
    permission_classes = [IsAuthenticated, IsAccountsExecutive]