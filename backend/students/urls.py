
from django.urls import path
from .views import StudentListCreateView, CentreListCreateView, BatchListCreateView

urlpatterns = [
    path("", StudentListCreateView.as_view(), name="students"),
    path("centres/", CentreListCreateView.as_view(), name="centre-list-create"),
    path("batches/", BatchListCreateView.as_view(), name="batch-list-create"),
]
