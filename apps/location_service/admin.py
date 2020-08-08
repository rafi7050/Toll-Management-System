from django.contrib import admin

# Register your models here.
from apps.location_service.models import Zone

admin.site.register(Zone)