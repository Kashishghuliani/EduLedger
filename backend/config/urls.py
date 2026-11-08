
from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication
    path("api/auth/token/", TokenObtainPairView.as_view()),
    path("api/auth/token/refresh/", TokenRefreshView.as_view()),


    # Accounts
    path("api/auth/", include("accounts.urls")),

    # Students
    path("api/students/", include("students.urls")),

    # Fees
    path("api/fees/", include("fees.urls")),

    # Payments
    path("api/payments/", include("payments.urls")),

    # Reminders
    path("api/reminders/", include("reminders.urls")),

    # Refunds
    path("api/refunds/", include("refunds.urls")),

    # Risk
    path("api/risk/", include("risk.urls")),

    # Dashboard
    path("api/dashboard/", include("dashboard.urls")),
]
