
from .models import Car_Admission
from django.forms import ModelForm
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
class Car_Admission_from(ModelForm):

    class Meta:
        model = Car_Admission
        fields = ['name','number','car_type','amount']


class CreateUserForm(UserCreationForm):
	class Meta:
		model = User
		fields = ['username', 'email', 'password1', 'password2']