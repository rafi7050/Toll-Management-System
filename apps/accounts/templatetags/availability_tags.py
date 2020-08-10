from datetime import datetime

from django import template
from django.core.exceptions import ObjectDoesNotExist

from apps.accounts.models import UserAvailability

register = template.Library()


@register.filter(name='availability')
def availability(self, value):
    try:
        user = UserAvailability.objects.get(user=value)
        today = datetime.now().date()
        if user.start < today < user.finish:
            return True
        else:
            return False
    except ObjectDoesNotExist:
        return False


# @register.filter(name='files_in_hand')
# def files_in_hand(self, value):
#     count = Application.objects.filter(assign_member=value, status__in=[1, 2]).count()
#     return count


@register.filter(name='strip_domain')
def strip_domain(value):
    return value.split('-')[1]
