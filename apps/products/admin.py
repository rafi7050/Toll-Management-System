from django.contrib import admin

# Register your models here.
from apps.products.models import Product, NutritionPoint, AgeGroup

admin.site.register(Product)
admin.site.register(AgeGroup)
admin.site.register(NutritionPoint)