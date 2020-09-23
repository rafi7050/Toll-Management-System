from rest_framework import serializers

from apps.products.models import Product, NutritionPoint, AgeGroup


class ProductsSerializer(serializers.ModelSerializer):
    unit = serializers.CharField(source='get_unit_display')

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'image', 'price', 'unit', 'nutrition', 'priority')


class NutritionPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionPoint
        fields = ('id', 'name', 'nutrition_point')

class AgeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgeGroup
        fields = ('id', 'name', 'age_from', 'age_to')
