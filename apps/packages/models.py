from django.db import models

# Create your models here.
from apps.helpers.models import OperatorStamp, TimeStamp
from apps.helpers.utils import SIZE, PACKAGE_TYPE
from apps.products.models import AgeGroup, NutritionPoint, Product


class Package(TimeStamp, OperatorStamp):
    name = models.CharField(max_length=255)
    size = models.IntegerField(choices=SIZE, default=1)
    age_group = models.ForeignKey(AgeGroup, on_delete=models.SET_NULL,null=True,blank=True)
    nutrition_point = models.ForeignKey(NutritionPoint, on_delete=models.SET_NULL,null=True,blank=True,verbose_name='Cure Disease Package')
    nutrition_details = models.TextField()
    discount_percentage = models.FloatField(default=0)
    suggestion = models.IntegerField(default=10)
    products = models.ManyToManyField(Product, through='PackageProduct')
    package_type = models.IntegerField(choices=PACKAGE_TYPE, default=1)

    def __str__(self):
        return self.name

class PackageProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE,related_name='package_to_product')
    package = models.ForeignKey(Package, on_delete=models.CASCADE,related_name='product_to_package')
    quantity = models.FloatField(default=1)
    price = models.FloatField(null=True)
