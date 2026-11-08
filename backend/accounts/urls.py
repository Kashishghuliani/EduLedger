from django.urls import path
from .views import (
    CurrentUserView,
    ParentListCreateView,
)

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("parents/", ParentListCreateView.as_view(), name="parent-list-create"),
]
