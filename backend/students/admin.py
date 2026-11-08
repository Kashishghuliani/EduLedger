from django.contrib import admin
from .models import Centre, Batch, Student, TestScore

admin.site.register([Centre, Batch, Student, TestScore])