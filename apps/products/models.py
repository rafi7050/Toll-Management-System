from django.db import models

# Create your models here.
from apps.helpers.models import OperatorStamp, TimeStamp
from apps.helpers.utils import UNIT


class ProductType(TimeStamp, OperatorStamp):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Product(TimeStamp, OperatorStamp):
    name = models.CharField(max_length=255)
    product_type = models.ForeignKey(ProductType, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField()
    price = models.FloatField()
    image = models.ImageField(upload_to='product', blank=True, null=True)
    unit = models.IntegerField(choices=UNIT, default=1)
    quantity = models.FloatField(default=1)
    nutrition = models.TextField()
    discount_percentage = models.FloatField(default=0)
    priority = models.IntegerField(default=1)

    def __str__(self):
        return self.name


class AgeGroup(TimeStamp, OperatorStamp):
    name = models.CharField(max_length=255, null=True, blank=True)
    age_from = models.CharField(max_length=10)
    age_to = models.CharField(max_length=10)

    def __str__(self):
        return self.age_from + ' - ' + self.age_to


class NutritionPoint(TimeStamp, OperatorStamp):
    name = models.CharField(max_length=255, null=True, blank=True)
    nutrition_point = models.CharField(max_length=255, verbose_name='Cure Disease Package Name')

    def __str__(self):
        return str(self.nutrition_point)
