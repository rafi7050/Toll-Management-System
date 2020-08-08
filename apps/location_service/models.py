from django.contrib.postgres.fields import JSONField
from django.db import models

# Create your models here.
# from apps.institute.models import Institute


class Division(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Upazila(models.Model):
    name = models.CharField(max_length=255)
    division = models.ForeignKey(Division, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.name


class Area(models.Model):
    name = models.CharField(max_length=255)
    upazila = models.ForeignKey(Upazila, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.name


class Zone(models.Model):
    name = models.CharField(max_length=255)
    area = JSONField(default=list, null=True, blank=True)

    def __str__(self):
        return self.name

#
# class InstituteLocation(models.Model):
#     institute = models.ForeignKey(Institute, on_delete=models.CASCADE, verbose_name='Institute Name')
#     location = models.ManyToManyField(Upazila, blank=True)
#
#     def __str__(self):
#         return self.institute.name
