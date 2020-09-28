from rest_framework import serializers

from apps.products.models import Product, NutritionPoint, AgeGroup, ProductType


class ProductsSerializer(serializers.ModelSerializer):
    unit = serializers.SerializerMethodField(read_only=True)
    quantity_name = serializers.SerializerMethodField(read_only=True)
    final_prize = serializers.SerializerMethodField(read_only=True)
    regular_prize = serializers.SerializerMethodField(read_only=True)

    def get_unit(self, obj):
        try:
            return obj.get_unit_display()
        except:
            return obj.unit

    def get_quantity_name(self, obj):
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

    def get_regular_prize(self, obj):
        try:
            return round(obj.price * obj.quantity)
        except:
            return round(obj.price)

    def get_final_prize(self, obj):
        try:
            return round((obj.price * obj.quantity) - (obj.price * obj.quantity) * obj.discount_percentage / 100)
        except:
            return round(obj.price)

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'image', 'price', 'unit', 'nutrition', 'priority', 'discount_percentage',
                  'regular_prize', 'final_prize', 'quantity', 'quantity_name')


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
