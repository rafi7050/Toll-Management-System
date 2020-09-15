from django.contrib.auth.models import User
from django.db.models import Value, Q
from django.db.models.functions import Concat

from apps.helpers.models import TypeModelChoiceField
from apps.packages.models import Package

from django.template.defaultfilters import register


def get_customer():
    return TypeModelChoiceField(
        queryset=User.objects.filter(is_staff=False, userprofile__user_type=2).order_by(
            "first_name").annotate(
            value=Concat('first_name', Value(''))), required=True, empty_label="Select Customer",
        error_messages={'required': 'Please select a customer'})


def get_package(order_details=None):
    queryset = Package.objects.filter(package_type=1).order_by("name").annotate(value=Concat('name', Value('')))
    if order_details:
        packages = order_details.order.orderdetails_set.all().values_list('package', flat=True)
        queryset = Package.objects.filter(Q(package_type=1) | Q(id__in=packages)).order_by("name").annotate(
            value=Concat('name', Value('')))

    return TypeModelChoiceField(
        queryset=queryset, required=False, empty_label="Select Package",
        error_messages={'required': 'Please select a package'})


@register.filter
def multiply(value, arg):
    return round((value * arg), 2)

@register.filter
def devide(value, arg):
    return round((value / arg), 2)


@register.filter
def modulas(value, arg):
    return round((value % arg), 2)

@register.filter
def even(value):
    if value % 2:
        return False
    return True

@register.filter
def odd(value):
    if value % 2:
        return True
    return False

@register.filter
def add(value, arg):
    try:
        return value + arg
    except:
        return 0


@register.filter
def percentage_sub(value, percent):
    return round((value - (percent / 100) * value), 2)


@register.filter
def percentage_add(value, percent):
    return round((value + (percent / 100) * value), 2)


@register.filter
def percentage(value, percent):
    return round((percent / 100) * value, 2)
