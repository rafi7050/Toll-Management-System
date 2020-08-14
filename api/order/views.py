import random
from datetime import datetime

from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.order.serializers import OrderSerializer, OrderDetailsSerializer
from api.package.serializers import PackageSerializer, PackageProductSerializer
from apps.packages.models import Package
from apps.products.models import Product
from apps.sales.models import Order


class ClientOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.none()
    serializer_class = OrderSerializer

    authentication_classes = (TokenAuthentication,)  # Add this line
    permission_classes = (IsAuthenticated,)  # Add this line

    def get_queryset(self):
        self.queryset = Order.objects.filter(customer=self.request.user)
        return self.queryset


class OrderViewSet(viewsets.ModelViewSet):
    http_method_names = ['post']
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    authentication_classes = (TokenAuthentication,)  # Add this line
    permission_classes = (IsAuthenticated,)  # Add this line

    def create(self, request, *args, **kwargs):
        data = request.data
        order_data = request.data
        order_details = data.get('order_details', None)

        packages = list(filter(lambda x: x.get('package', None), order_details))
        product = list(filter(lambda x: x.get('product', None), order_details))

        if product:
            product_serialize_data = self.product_package_create(product)
            if product_serialize_data:
                package_id = product_serialize_data.get('id', None)
                if package_id:
                    package_price = self.package_price(package_id)
                    package = {
                        'package': package_id,
                        'price': package_price,
                        'quantity': 1,
                        'total_price': package_price
                    }

                    packages.append(package)
        try:
            order_amount = sum(float(x['total_price']) for x in packages)
            order_data['total_amount'] = order_amount
        except:
            pass

        serializer = self.get_serializer(data=order_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        data = serializer.data
        order_id = data.get('id', None)

        if order_id:
            for itemp in packages:
                itemp['order'] = order_id

            order_details_serializer = OrderDetailsSerializer(data=packages, many=True)
            order_details_serializer.is_valid(raise_exception=True)
            order_details_serializer.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()

    def product_package_create(self, product):
        customer = self.request.user.get_full_name()

        package_name = 'Simple - ' + customer + "(" + datetime.today().strftime('%Y-%m-%d') + ")"
        try:
            products = list(map(lambda a: a['product'], product))
            package_name = '-'.join(list(Product.objects.filter(id__in=products).values_list('name',
                                                                                             flat=True))) + " - " + customer + "(" + datetime.today().strftime(
                '%Y-%m-%d') + ")"
        except:
            pass

        package = {
            "name": package_name,
            "size": 1,
            "nutrition_details": "Sample",
            "discount_percentage": 0.0,
            "suggestion": 10,
            "age_group": 1,
            "nutrition_point": 1,
            'products': product
        }
        package_serializer = PackageSerializer(data=package)
        package_serializer.is_valid(raise_exception=True)
        package_serializer.save(created_by=self.request.user)

        package_id = package_serializer.data.get('id', None)

        if package_id:
            for item in product:
                item['package'] = package_id

            package_item_serializer = PackageProductSerializer(data=product, many=True)
            package_item_serializer.is_valid(raise_exception=True)
            package_item_serializer.save()

        return package_serializer.data

    def package_price(self, package):
        try:
            this_package = Package.objects.get(id=package)
            products = this_package.products.through.objects.filter(package=this_package)
            discount = this_package.discount_percentage
            total_amount = 0
            for item in products:
                total_amount += item.quantity * item.product.price

            if total_amount:
                discount_amount = total_amount * discount / 100
                total_amount = total_amount - discount_amount
            return round(total_amount, 2)
        except:
            return 0
