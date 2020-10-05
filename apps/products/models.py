from django.db import models

# Create your models here.
from apps.helpers.models import OperatorStamp, TimeStamp
from apps.helpers.utils import UNIT

def QuantityUnitName(obj):
    try:
        if obj.get_unit_display() == 'KG':
            if obj.quantity < 1:
                quantity = obj.quantity * 1000
                if int(quantity) == quantity:
                    quantity = int(quantity)
                return str(quantity) + ' gm'
            else:
                if int(obj.quantity) == obj.quantity:
                    return str(int(obj.quantity)) + ' KG'
                else:
                    return str(obj.quantity) + ' KG'
        else:
            if int(obj.quantity) == obj.quantity:
                return str(int(obj.quantity)) + ' ' + obj.get_unit_display()
            else:
                return str(obj.quantity) + ' ' + obj.get_unit_display()
    except:
        try:
            return obj.get_unit_display()
        except:
            pass

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
        return self.name +' - '+QuantityUnitName(self)


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
