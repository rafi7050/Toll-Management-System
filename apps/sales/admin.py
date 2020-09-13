from django.contrib import admin

# Register your models here.
from apps.sales.models import Order

admin.site.register(Order)