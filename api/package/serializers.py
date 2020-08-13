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

    total_amount = serializers.SerializerMethodField()
    regular_price = serializers.SerializerMethodField()

    # products = PackageProductSerializer(many=True,required=False,write_only=True)

    def get_regular_price(self, obj):
        products = obj.products.through.objects.filter(package=obj)

        regular_price = 0
        for item in products:
            regular_price += float(item.quantity) * float(item.product.price)
        return regular_price

    def get_total_amount(self, obj):
        products = obj.products.through.objects.filter(package=obj)
        discount = obj.discount_percentage
        total_amount = 0
        for item in products:
            total_amount += item.quantity * item.product.price

        if total_amount:
            discount_amount = total_amount * discount / 100
            total_amount = total_amount - discount_amount
        return round(total_amount, 2)

    class Meta:
        model = Package
        exclude = ('created_at','updated_at','created_by','updated_by','package_type',)
