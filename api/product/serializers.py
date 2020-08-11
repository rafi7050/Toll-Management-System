from rest_framework import serializers

from apps.products.models import Product


class ProductsSerializer(serializers.ModelSerializer):
    unit = serializers.CharField(source='get_unit_display')

    class Meta:
        model = Product
        fields = ('name', 'description', 'image', 'price', 'unit', 'nutrition')
