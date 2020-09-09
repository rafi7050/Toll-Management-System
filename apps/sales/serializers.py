import datetime
from datetime import timedelta

from rest_framework import serializers

from apps.helpers.utils import today_start
from apps.location_service.models import Zone
from apps.packages.models import Package
from apps.products.models import Product
from apps.sales.models import Order, OrderDetails, OrderActivityLog


class OrderSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%B %d, %Y', read_only=True)
    customer_name = serializers.SerializerMethodField()
    order_status_name = serializers.CharField(source='get_order_status_display')
    def get_customer_name(self, obj):
        customer = obj.customer
        if customer:
            return customer.first_name

    # order_status_name = serializers.CharField(source='get_order_status_display', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


class OrderDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetails
        fields = '__all__'


class OrderedProductSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%B %d, %Y', read_only=True)
    # order_status_name = serializers.CharField(source='get_order_status_display', read_only=True)
    quantity = serializers.SerializerMethodField(read_only=True)

    def get_quantity(self, obj):
        order_type = self.context.get('order_type', 'active')
        if order_type == 'active':
            order_details = OrderDetails.objects.filter(package__products__in=[obj.id], order__order_status__in=[1], order__created_at__lt=today_start)
        else:
            order_details = OrderDetails.objects.filter(package__products__in=[obj.id], order__order_status__in=[1], order__created_at__gte=today_start)

		
        quantity = 0

        for item in order_details:
            package_product = item.package.products.through.objects.filter(package=item.package, product=obj)
            for item2 in package_product:
                print(item2.product, item2.quantity, item.package)
                quantity += item2.quantity
        return quantity

    class Meta:
        model = Product
        fields = '__all__'


class OrderedPackageSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%B %d, %Y', read_only=True)
    # order_status_name = serializers.CharField(source='get_order_status_display', read_only=True)
    quantity = serializers.SerializerMethodField(read_only=True)

    def get_quantity(self, obj):
        order_type = self.context.get('order_type', 'active')
        if order_type == 'active':
            order_details = OrderDetails.objects.filter(package=obj, order__order_status__in=[2], order__created_at__lt=today_start)
        else:
            order_details = OrderDetails.objects.filter(package=obj, order__created_at__gte=today_start)

        quantity = 0

        for item in order_details:
            quantity += item.quantity

        return quantity

    class Meta:
        model = Package
        fields = '__all__'


class OrderActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderActivityLog
        fields = '__all__'


class ZoneOrderSerializer(serializers.ModelSerializer):
    order = serializers.SerializerMethodField(read_only=True)

    def get_order(self, obj):
        order_type = self.context.get('order_type', 'active')
        today = datetime.datetime.combine(datetime.date.today(), datetime.datetime.min.time())
        if order_type == 'active':
            return Order.objects.filter(order_status=2, zone=obj, created_at__lt=today).count()
        else:
            return Order.objects.filter( zone=obj, created_at__gte=today).count()

    class Meta:
        model = Zone
        exclude = ('area',)
