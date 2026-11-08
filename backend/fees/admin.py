from django.contrib import admin
from .models import FeePlan, Installment

admin.site.register(FeePlan)
admin.site.register(Installment)