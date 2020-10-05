from rest_framework import serializers

from apps.packages.models import Package, PackageProduct


class PackageProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageProduct
        fields = '__all__'


class PackageSerializer(serializers.ModelSerializer):
    total_amount = serializers.SerializerMethodField()
    regular_price = serializers.SerializerMethodField()
    size_name = serializers.SerializerMethodField()
    updated_at = serializers.DateTimeField(format='%B %d, %Y', read_only=True)

    def get_size_name(self, obj):
        try:
            return obj.get_size_display()
        except:
            pass

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
        fields = '__all__'

    # def create(self, validated_data):
    #     products = validated_data.pop('products')
    #     package = Package.objects.create(**validated_data)
    #     package.save()
    #     # details_id = EligibilityCardDetails.objects.bulk_create(card_details_data)
    #
    #     for item in products:
    #         item['package'] = package
    #         PackageProduct.objects.create(**item)
    #     return package
