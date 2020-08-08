from rest_framework import serializers

from apps.packages.models import Package, PackageProduct
from apps.products.models import Product


class ProductsSerializer(serializers.ModelSerializer):
    unit = serializers.CharField(source='get_unit_display')

    class Meta:
        model = Product
        fields = ('name', 'description', 'image', 'price', 'unit', 'nutrition')


class PackageProductsSerializer(serializers.ModelSerializer):
    product = ProductsSerializer(read_only=True)
    quantity_name = serializers.SerializerMethodField(read_only=True)
    price = serializers.SerializerMethodField(read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.image.url', read_only=True)

    def get_price(self, obj):
        price = obj.product.price
        quantity = obj.quantity
        return price * quantity

    def get_quantity_name(self, obj):
        unit = obj.product.get_unit_display()
        quantity = obj.quantity
        return str(quantity) + ' ' + unit

    class Meta:
        model = PackageProduct
        exclude = ('id', 'package',)


class PackageSerializer(serializers.ModelSerializer):
    products = PackageProductsSerializer(source='product_to_package', read_only=True, many=True)

    class Meta:
        model = Package
        exclude = ('created_at','updated_at','created_by','updated_by','package_type',)
