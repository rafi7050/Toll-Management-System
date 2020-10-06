from rest_framework import serializers

from api.package.serializers import PackageSerializer
from apps.sales.models import Order, OrderDetails


class OrderDetailsSerializer(serializers.ModelSerializer):
    package_details = PackageSerializer(source='package', read_only=True)

    name = serializers.SerializerMethodField(read_only=True)

    def get_name(self, obj):
        try:
            return obj.package.name
        except:
            try:
                return obj.product.name
            except:
                pass

    class Meta:
        model = OrderDetails
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    order_details = serializers.SerializerMethodField(read_only=True)

    def get_order_details(self, obj):
        order_details = OrderDetails.objects.filter(order=obj)
        return OrderDetailsSerializer(order_details, many=True).data

    class Meta:
        model = Order
        fields = '__all__'
