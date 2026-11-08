
from django.urls import path
from .views import FeePlanCreateView, StudentFeeLedgerView

urlpatterns = [
    path("plans/", FeePlanCreateView.as_view(), name="create-fee-plan"),
    path("ledger/<int:pk>/", StudentFeeLedgerView.as_view(), name="student-fee-ledger"),
]
