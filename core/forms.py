
from .models import Car_Admission
from django.forms import ModelForm
from django import forms

class Car_Admission_from(ModelForm):

    class Meta:
        model = Car_Admission
        fields = ['name','number','car_type','amount','date_now']