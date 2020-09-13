from django.contrib import admin

# Register your models here.
from apps.packages.models import Package, PackageProduct

admin.site.register(Package)
admin.site.register(PackageProduct)