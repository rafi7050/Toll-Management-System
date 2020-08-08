from django.contrib import admin

# Register your models here.
from apps.accounts.models import UserProfile

admin.site.register(UserProfile)