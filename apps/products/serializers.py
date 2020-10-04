from rest_framework import serializers

from apps.helpers.function import get_quantity_name
from apps.products.models import Product, AgeGroup, NutritionPoint, ProductType


class ProductSerializer(serializers.ModelSerializer):
    product_type_name = serializers.SerializerMethodField(read_only=True)
    # product_name_quantity = serializers.SerializerMethodField(read_only=True)
    total_amount = serializers.SerializerMethodField(read_only=True)
    updated_at = serializers.DateTimeField(format='%B %d, %Y', read_only=True)

    def get_product_type_name(self, obj):
        try:
            return obj.product_type.name
        except:
            pass

    def get_total_amount(self, obj):
        try:
            total_amount = obj.price * obj.quantity
            return round(total_amount - (total_amount*obj.discount_percentage/100),2)
        except:
            pass

    # def get_product_name_quantity(self, obj):
    #     try:
    #         return obj.name + get_quantity_name(obj)
    #     except:
    #         pass

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
