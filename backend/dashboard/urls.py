from django.urls import path
from .views import AccountsDashboardView

urlpatterns = [
    path("", AccountsDashboardView.as_view(), name="accounts-dashboard"),
]