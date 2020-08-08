from rest_framework import serializers

from apps.products.models import Product, AgeGroup, NutritionPoint


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class AgeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgeGroup
        fields = '__all__'


class NutritionPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionPoint
        fields = '__all__'

