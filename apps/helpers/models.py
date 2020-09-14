import json
import uuid
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Value
from django.db.models.functions import Concat
from django.forms import ModelChoiceField
from shapely.geometry import Point, Polygon

from apps.location_service.models import Zone
from .utils import STATUS_TYPE
from django.template.defaulttags import register


class OperatorStamp(models.Model):
    created_by = models.ForeignKey(User, related_name='+', on_delete=models.SET_NULL, blank=True, null=True)
    updated_by = models.ForeignKey(User, related_name='+', on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        abstract = True


class TimeStamp(models.Model):
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True, null=True)

    class Meta:
        abstract = True


class CommonModel(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices=STATUS_TYPE, default=0)

    class Meta:
        abstract = True


class WithCreatorCommonModel(CommonModel):
    created_by = models.ForeignKey(User, related_name='+', on_delete=models.SET_NULL, blank=True, null=True)
    updated_by = models.ForeignKey(User, related_name='+', on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        abstract = True


class ServiceTimeStampModel(models.Model):
    created_by = models.ForeignKey(User, related_name='+', on_delete=models.DO_NOTHING, blank=True, null=True)
    updated_by = models.ForeignKey(User, related_name='+', on_delete=models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True, null=True)
    status = models.IntegerField(choices=STATUS_TYPE, default=0)

    class Meta:
        abstract = True


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


@register.filter
def get_item_display(dictionary, key):
    try:
        key = int(key)
    except:
        key = 0
    return dictionary.get(key)


@register.filter
def loadjson(data):
    return json.loads(data)


def formset_deleted_object(formset):
    queryset = formset.queryset
    clean_data = formset.cleaned_data
    form_ids = []
    instance_ids = []
    for item in clean_data:
        item_obj = item.get('id', None)
        if item_obj:
            item_id = item_obj.id
            form_ids.append(item_id)

    for item2 in queryset:
        instance_ids.append(item2.id)
    return list(set(instance_ids) - set(form_ids))


def get_location_zone(lat, long):
    area_zone = Zone.objects.all()
    zone = None
    if lat and long:
        lat = float(lat)
        long = float(long)
        for item in area_zone:
            polygon_area = item.area
            pt = Point(long, lat)
            poly = Polygon(polygon_area)
            pc = poly.contains(pt)
            if pc:
                zone = item

    return zone


class TypeModelChoiceField(ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.value


