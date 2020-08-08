from rest_framework import serializers

from apps.location_service.models import Zone
from .models import (Division, Upazila)


class DivisionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Division
        fields = ('url', 'id', 'name')
        datatables_always_serialize = ('id',)


class UpazilaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    division_name = serializers.ReadOnlyField(source='division.name')

    class Meta:
        model = Upazila
        fields = ('url', 'id', 'name', 'division', 'division_name')
        datatables_always_serialize = ('id',)


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = '__all__'