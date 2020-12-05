from django.db import models

# Create your models here.

class Car_Admission(models.Model):
    name = models.CharField(max_length=200,verbose_name="Name")
    number = models.CharField(max_length=200)
    car_type = models.CharField(max_length=200)
    amount = models.IntegerField(max_length=11)
    date_now = models.DateField(blank=True)
   
 

    def __str__(self):
        return self.name