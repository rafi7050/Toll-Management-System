from rest_framework import serializers

from apps.products.models import Product, NutritionPoint, AgeGroup, ProductType


class ProductsSerializer(serializers.ModelSerializer):
    unit = serializers.CharField(source='get_unit_display')
    final_prize = serializers.SerializerMethodField(read_only=True)

    def get_final_prize(self,obj):
        try:
            return obj.price-obj.price*obj.discount_percentage/100
        except:
            return obj.price

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'image', 'price', 'unit', 'nutrition', 'priority','discount_percentage','final_prize')


class NutritionPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionPoint
        fields = ('id', 'name', 'nutrition_point')

class AgeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgeGroup
        fields = ('id', 'name', 'age_from', 'age_to')

class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = ('id', 'name')
