from django.conf import settings
from django.contrib.auth.models import Permission, User, Group
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from apps.helpers.utils import GENDER_CHOICES, CUSTOMER_STATUS_CHOICES, USER_TYPE, USER_PROFESSION_CHOICES
from apps.helpers.models import TimeStamp, OperatorStamp
# from apps.institute.models import Institute
from django.contrib.postgres.fields import JSONField
# Create your models here.
from apps.location_service.models import Upazila, Division, Zone


class GroupProfile(TimeStamp, OperatorStamp):
    name = models.OneToOneField(Group, on_delete=models.CASCADE)
    can_view_dashboard = models.BooleanField(default=False)
    # institute = models.ForeignKey(Institute, on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name.name


class UserProfileManager(models.Manager):
    def get_all(self):
        return super().get_queryset().exclude(id=1)


class UserProfile(TimeStamp, OperatorStamp):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dob = models.DateField(blank=True, null=True)
    # institute = models.ForeignKey(Institute, on_delete=models.CASCADE, blank=True, null=True)
    gender = models.IntegerField(choices=GENDER_CHOICES, blank=True, null=True)
    profile_image = models.ImageField(upload_to='userprofile', blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    division = models.ForeignKey(Division, blank=True, null=True, on_delete=models.DO_NOTHING, related_name='division')
    location = models.ForeignKey(Upazila, blank=True, null=True, on_delete=models.DO_NOTHING, related_name='upazila')
    is_institute_admin = models.BooleanField(default=False, null=True, blank=True)
    status = models.IntegerField(choices=CUSTOMER_STATUS_CHOICES, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    call_time = models.DateTimeField(blank=True, null=True)
    user_type = models.IntegerField(choices=USER_TYPE, blank=True, null=True)
    is_team_leader = models.BooleanField(default=False)
    # extra profile
    profession = models.IntegerField(choices=USER_PROFESSION_CHOICES, blank=True, null=True)
    etin = models.BooleanField(default=False)
    tnt = models.BooleanField(default=False)
    security_cheque = models.BooleanField(default=False)
    nid = models.BooleanField(default=False)
    passport = models.BooleanField(default=False)
    monthly_income = models.FloatField(null=True, blank=True)
    profession_income_info = JSONField(default=dict, null=True, blank=True)
    co_applicant_info = JSONField(default=dict, null=True, blank=True)
    property_info = JSONField(default=dict, null=True, blank=True)
    car_info = JSONField(default=dict, null=True, blank=True)
    loan_type = models.IntegerField(blank=True, null=True)
    takeover_topup_info = JSONField(default=dict, null=True, blank=True)
    can_see_dashboard = models.BooleanField(default=False)
    zone = models.ManyToManyField(Zone, blank=True)
    extension_no = models.CharField(blank=True, null=True, max_length=30)
    speed = models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Sales Person Speed km/h')
    # application_bank = models.ForeignKey(Institute, related_name='+', on_delete=models.CASCADE, blank=True, null=True)
    otp = models.CharField(max_length=10, null=True, blank=True)
    objects = UserProfileManager()

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created and not instance.is_staff:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.userprofile.save()
    except:
        pass


class UserAvailability(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start = models.DateField(verbose_name='From')
    finish = models.DateField(verbose_name='To')

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
