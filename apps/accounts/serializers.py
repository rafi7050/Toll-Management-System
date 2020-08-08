import collections
import itertools
from datetime import datetime, timedelta, date

import googlemaps
import pytz
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.accounts.models import UserAvailability, GroupProfile
from apps.accounts.utils import phone_numbers
from pricing.settings import GOOGLE_MAPS_KEY
from . import models


class UserSerializer(serializers.ModelSerializer):
    # email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all(), message='A user with that email already exists')],
    #                                required=False)

    class Meta:
        model = User
        exclude = ['user_permissions', 'groups']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            email=validated_data['email'],
            is_staff=False,
            is_active=False
        )
        user.set_password(validated_data['password'])
        user.userprofile.user_type = 2
        user.save()

        return user

    def validate(self, data):
        username = data.get('username', None)
        if username and username.isdigit():
            try:
                check = int(username)
            except ValueError:
                raise serializers.ValidationError({
                    "username": ["Enter a valid phone number"],
                })

            if '+' in username:
                raise serializers.ValidationError({
                    "username": ["No need to add country code"],
                })
            if not username[:3] in phone_numbers:
                raise serializers.ValidationError({
                    "username": ["Enter a valid phone number"],
                })
            if len(username) != 11:
                raise serializers.ValidationError({
                    "username": ["Phone number should be 11 digits following zero"],
                })
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    location_division = serializers.CharField(source='location.division.id', read_only=True)
    gender_name = serializers.CharField(source='get_gender_display', read_only=True)
    availability = serializers.SerializerMethodField(read_only=True)

    member_type = serializers.SerializerMethodField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)



    def get_availability(self, obj):
        user = UserAvailability.objects.filter(user__username=obj).order_by('-id').first()
        today = datetime.now().date()
        if user and user.start <= today <= user.finish:
            return False
        else:
            return True

    def get_full_name(self, obj):
        if obj.user.first_name:
            return obj.user.first_name + " " + obj.user.last_name
        else:
            return obj.user.username


    def get_member_type(self, obj):
        user = models.UserProfile.objects.get(user__username=obj)
        if user.user.is_staff and user.user.is_superuser:
            userstatus = 'Super Admin'
        elif user.user.is_staff:
            userstatus = 'BCBD Member'
        elif user.is_institute_admin:
            userstatus = 'Bank Admin'
        else:
            userstatus = 'Bank Member'
        return userstatus

    class Meta:
        model = models.UserProfile
        datatables_always_serialize = ('id',)
        fields = ['id', 'user', 'username', 'email', 'first_name', 'last_name', 'profile_image', 'address',
                  'dob', 'location', 'location_name', 'location_division', 'gender', 'gender_name', 'availability', 'member_type', 'full_name']


class GroupProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    is_sales = serializers.SerializerMethodField(read_only=True)

    def get_name(self, obj):
        return obj.name.name.split('-')[1]

    def get_is_sales(self, obj):
        return None

    class Meta:
        model = GroupProfile
        fields = '__all__'



