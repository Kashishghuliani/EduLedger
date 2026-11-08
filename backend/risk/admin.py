from django.contrib import admin
from .models import RiskAssessment, CounsellorTask

admin.site.register([RiskAssessment, CounsellorTask])