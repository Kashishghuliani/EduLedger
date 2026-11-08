
from django.urls import path
from .views import MockPaymentView

urlpatterns = [
    path("mock/", MockPaymentView.as_view(), name="mock-payment"),
]
