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

@register.filter
def get_quantity_name(obj):
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

@register.filter
def get_unit_name(obj):
    try:
        if int(obj.quantity) == obj.quantity:
            return str(int(obj.quantity)) + ' ' + obj.get_unit_display()
        else:
            return str(obj.quantity) + ' ' + obj.get_unit_display()
    except:
        obj.unit

@register.simple_tag(name="order_details_regroup")
def order_details_regroup(order):
    print(order.customer)
    order_details = order.orderdetails_set.all()
    order_details_packages = order_details.filter(package__isnull=False)
    order_details_products = order_details.filter(product__isnull=False)
    print(order_details_packages,order_details_products)
    return {'packages':order_details_packages,'products':order_details_products}
