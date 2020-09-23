from rest_framework import serializers

from apps.products.models import Product, AgeGroup, NutritionPoint, ProductType


class ProductSerializer(serializers.ModelSerializer):
    product_type_name = serializers.SerializerMethodField(read_only=True)
    updated_at = serializers.DateTimeField(format='%B %d, %Y', read_only=True)

    def get_product_type_name(self, obj):
        try:
            return obj.product_type.name
        except:
            pass

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


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = '__all__'
