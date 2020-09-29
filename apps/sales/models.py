import random

from django.contrib.auth.models import User
from django.db import models

# Create your models here.
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.helpers.models import OperatorStamp, TimeStamp
from apps.helpers.utils import ORDER_STATUS, FOLLOW_UP_PURPOSE, ORDER_ITEM_TYPE
from apps.location_service.models import Zone
from apps.packages.models import Package
from apps.products.models import Product


class Order(OperatorStamp, TimeStamp):
    customer_full_name = models.CharField(max_length=255, null=True, blank=True)
    assign_user = models.ForeignKey(User, related_name='+', on_delete=models.SET_NULL, null=True, blank=True)
    order_status = models.IntegerField(choices=ORDER_STATUS, default=1)
    code = models.CharField(max_length=50, blank=True, null=True)
    customer = models.ForeignKey(User, related_name='+', on_delete=models.SET_NULL, null=True, blank=True)
    address_line_1 = models.TextField()
    address_line_2 = models.TextField(null=True,blank=True)
    place = models.CharField(max_length=255,null=True,blank=True)
    zip = models.CharField(max_length=5,null=True,blank=True)
    latitude = models.CharField(max_length=50, null=True, blank=True)
    longitude = models.CharField(max_length=50, null=True, blank=True)
    zone = models.ForeignKey(Zone, on_delete=models.SET_NULL, null=True, blank=True)
    mobile_number = models.CharField(max_length=20)
    total_amount = models.FloatField()

    def __str__(self):
        return self.code


@receiver(post_save, sender=Order)
def update_code(sender, instance, **kwargs):
    if not instance.code:
        instance.code = 'ORD-' + str(random.randrange(100, 999))
        post_save.disconnect(update_code, sender=Order)
        instance.save()
        post_save.connect(update_code, sender=Order)


class OrderDetails(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    package = models.ForeignKey(Package, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    price = models.FloatField(null=True, blank=True)
    quantity = models.FloatField(null=True, blank=True, default=1)
    total_price = models.FloatField(null=True, blank=True)
    item_type = models.IntegerField(choices=ORDER_ITEM_TYPE, default=1, null=True, blank=True)


#
# class OrderProductDetails(models.Model):
#     order = models.ForeignKey(Order, on_delete=models.CASCADE)
#     package = models.ForeignKey(Package, on_delete=models.CASCADE, null=True, blank=True)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
#     price = models.FloatField(null=True, blank=True)
#     quantity = models.FloatField(null=True, blank=True,default=1)
#     total_price = models.FloatField(null=True, blank=True)


class OrderActivityLog(OperatorStamp, TimeStamp):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    status = models.IntegerField(choices=ORDER_STATUS, default=1)
    remarks = models.TextField(blank=True, null=True)


class OrderFollowUp(OperatorStamp, TimeStamp):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    call_purpose = models.IntegerField(choices=FOLLOW_UP_PURPOSE, default=0)
    remark = models.TextField(blank=True, null=True)


class OrderForward(OperatorStamp, TimeStamp):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    remark = models.TextField(max_length=255)
    assign_from = models.ForeignKey(User, related_name='+', on_delete=models.SET_NULL, null=True, blank=True)
    assign_to = models.ForeignKey(User, related_name='+', on_delete=models.SET_NULL, null=True, blank=True)
