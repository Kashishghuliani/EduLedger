
from django.urls import path
from .views import RefundCreateView, RefundListView

urlpatterns = [
    path("", RefundListView.as_view(), name="refund-list"),
    path("calculate/", RefundCreateView.as_view(), name="refund-calculate"),
]
