from django.urls import path
from .views import ReminderListView, GenerateRemindersView

urlpatterns = [
    path("", ReminderListView.as_view(), name="reminder-list"),
    path("generate/", GenerateRemindersView.as_view(), name="generate-reminders"),
]