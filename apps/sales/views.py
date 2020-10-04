from datetime import datetime

from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.db import transaction
from django.db.models import Sum, Count, Q
from django.shortcuts import render

# Create your views here.
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DetailView, TemplateView
from django_pdfkit import PDFView
from wkhtmltopdf.views import PDFTemplateView
from rest_framework import viewsets, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.helpers.models import formset_deleted_object
from apps.helpers.utils import ORDER_STATUS, today_start
from apps.location_service.models import Zone
from apps.packages.models import Package
from apps.packages.serializers import PackageSerializer, PackageProductSerializer
from apps.products.models import Product
from apps.sales.forms import OrderForm, OrderDetailsFormset, OrderDetailsUpdateFormset
from apps.sales.models import Order, OrderDetails, OrderActivityLog
from apps.sales.serializers import OrderSerializer, OrderedProductSerializer, OrderedPackageSerializer, \
    OrderActivityLogSerializer, OrderDetailsSerializer, ZoneOrderSerializer


class OrderListView(LoginRequiredMixin, ListView):
    # class OrderListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    # permission_required = 'sales.view_order'
    model = Order
    template_name = 'sales/order/list.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['zone'] = Zone.objects.all()
        context['order_status'] = ORDER_STATUS
        return context


class OrderListNewView(LoginRequiredMixin, ListView):
    # class OrderListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    # permission_required = 'sales.view_order'
    model = Order
    template_name = 'sales/order/new_list.html'


class OrderCreateView(CreateView):
    model = Order
    form_class = OrderForm
    template_name = 'sales/order/create.html'
    success_url = reverse_lazy('order_list')

    def get_context_data(self, **kwargs):
        data = super(OrderCreateView, self).get_context_data(**kwargs)
        if self.request.POST:
            data['order_details'] = OrderDetailsFormset(self.request.POST)
        else:
            data['order_details'] = OrderDetailsFormset()
        return data

    def form_valid(self, form):
        context = self.get_context_data()
        order_details = context['order_details']
        with transaction.atomic():
            form.instance.created_by = self.request.user
            self.object = form.save()
            if order_details.is_valid():
                order_details.instance = self.object
                order_details.save()
        return super(OrderCreateView, self).form_valid(form)


class OrderUpdateView(UpdateView):
    model = Order
    form_class = OrderForm
    template_name = 'sales/order/create.html'
    success_url = reverse_lazy('order_list')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        if self.request.POST:
            data['order_details'] = OrderDetailsUpdateFormset(self.request.POST, instance=self.object)
            data['order_details'].full_clean()
        else:
            data['order_details'] = OrderDetailsUpdateFormset(instance=self.object)
        return data

    def form_valid(self, form):
        context = self.get_context_data()
        order_details = context["order_details"]
        print(order_details.deleted_forms, 'deleted form', order_details)
        with transaction.atomic():
            form.instance.updated_by = self.request.user
            self.object = form.save()
            if order_details.is_valid():
                order_details.instance = self.object
                deleted_items = formset_deleted_object(order_details)
                OrderDetails.objects.filter(id__in=deleted_items).delete()
                order_details.save()
        return super().form_valid(form)


class OrderDetailsView(LoginRequiredMixin, PermissionRequiredMixin, DetailView):
    permission_required = 'sales.view_order'
    slug_url_kwarg = 'uuid'
    slug_field = 'uuid'
    model = Order
    template_name = 'sales/order/details.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['uuid'] = self.kwargs.get('uuid')
        return context


def OrderDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    permission_required = 'sales.delete_order'
    model = Order
    template_name = 'sales/order/delete.html'
    success_url = reverse_lazy('order_list')


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        order_details = data.get('order_details', None)

        packages = list(filter(lambda x: x.get('package', None), order_details))
        product = list(filter(lambda x: x.get('product', None), order_details))

        if product:
            product_serialize_data = self.product_package_create(product)
            if product_serialize_data:
                package = {
                    'package': product_serialize_data.get('id', None),
                    'price': 1,
                    'quantity': 1,
                    'total_price': 1
                }

                packages.append(package)

        serializer = self.get_serializer(data=request.data)
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
        package = {
            "name": "Sample",
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


class OrderedProduct(LoginRequiredMixin, ListView):
    # class OrderListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    # permission_required = 'sales.view_order'
    model = Product
    template_name = 'sales/order/order_products.html'


class OrderedProductSizeQuantity(LoginRequiredMixin, ListView):
    # class OrderListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    # permission_required = 'sales.view_order'
    model = Product
    template_name = 'sales/order/order_product_size_quantity.html'


class OrderedProductSizeViewSet(APIView):
    queryset = Product.objects.none()

    def get(self, request):
        order_type = self.request.query_params.get('order_type', 'active')
        if order_type == 'active':
            order_details = OrderDetails.objects.filter(order__order_status__in=[2], order__created_at__lt=today_start)
        else:
            order_details = OrderDetails.objects.filter(order__created_at__gte=today_start)

        order_product_quantity = []

        order_package_products = order_details.filter(package__product_to_package__product__isnull=False).values(
            'package__product_to_package__quantity', 'package__product_to_package__product').annotate(
            count=Count('package'))
        print(order_package_products, 'Order Products')

        for item in order_package_products:
            product_id = item.get('package__product_to_package__product', None)
            product = Product.objects.filter(id=product_id).first()
            quantity = str(item.get('package__product_to_package__quantity', None))
            unit = product.get_unit_display()
            product_size = quantity + ' ' + unit

            product_size_quantity = {
                'product_size': product_size,
                'quantity': item.get('package__product_to_package__quantity', None),
                'count': item.get('count', None),
                'unit': product.get_unit_display(),
            }

            try:
                single_product = next(item for item in order_product_quantity if item["id"] == product_id)
                try:
                    single_product['product_size_quantity'].append(product_size_quantity)
                except:
                    single_product['product_size_quantity'] = []
                    single_product['product_size_quantity'].append(product_size_quantity)
            except:
                single_product = {
                    'id': product.id,
                    'name': product.name,
                    'image': product.image.url,
                    'product_size_quantity': []
                }
                single_product['product_size_quantity'].append(product_size_quantity)

                order_product_quantity.append(single_product)

        order_products = order_details.filter(product__isnull=False).values('quantity', 'product_id').annotate(count=Count('product'))
        print(order_products,'Products')
        for item3 in order_products:
            product_id = item3.get('product_id', None)
            quantity = item3.get('quantity', None)
            count = item3.get('count', None)
            product = Product.objects.filter(id=product_id).first()
            unit = product.get_unit_display()
            product_size = str(quantity*product.quantity) + ' ' + unit

            product_size_quantity = {
                'product_size': product_size,
                'quantity': quantity,
                'count': count,
                'unit': unit,
            }

            try:
                single_product = next(item for item in order_product_quantity if item["id"] == product_id)
                try:
                    product_size_quantity_obj = single_product['product_size_quantity']
                    try:
                        product_size_quantity_obj_product_size = next(
                            item for item in product_size_quantity_obj if item['product_size'] == product_size)
                        product_size_quantity_obj_product_size['count'] = float(
                            product_size_quantity_obj_product_size['count']) + count
                    except:
                        single_product['product_size_quantity'].append(product_size_quantity)

                except:
                    single_product['product_size_quantity'] = []
                    single_product['product_size_quantity'].append(product_size_quantity)
            except:
                single_product = {
                    'id': product.id,
                    'name': product.name,
                    'image': product.image.url,
                    'product_size_quantity': []
                }
                single_product['product_size_quantity'].append(product_size_quantity)

                order_product_quantity.append(single_product)

        print(order_product_quantity)
        return Response(order_product_quantity)


class OrderedProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = OrderedProductSerializer

    def get_serializer_context(self):
        return self.request.query_params

    def get_queryset(self):
        order_type = self.request.query_params.get('order_type', 'active')

        # try:
        #     f = open("guru99.txt", "a+")
        #     f.write('\n'+today_start.strftime("%d/%m/%Y %H:%M:%S"))
        #     f.close()
        # except:
        #     handle1 = open("guru99.txt", "w+")
        #     handle1.close()
        #
        #     f = open("guru99.txt", "a+")
        #     f.write('\n'+today_start.strftime("%d/%m/%Y %H:%M:%S"))
        #     f.close()

        if order_type == 'active':
            order = Order.objects.filter(order_status=2, created_at__lt=today_start)
        else:
            order = Order.objects.filter(created_at__gte=today_start)
        self.queryset = Product.objects.filter(
            Q(package__orderdetails__order__in=order) | Q(orderdetails__order__in=order)).distinct()

        return self.queryset


class OrderedPackage(LoginRequiredMixin, ListView):
    model = Package
    template_name = 'sales/order/order_packages.html'


class OrderedPackageListViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = OrderedPackageSerializer

    def get_serializer_context(self):
        return self.request.query_params

    def get_queryset(self):
        order_type = self.request.query_params.get('order_type', 'active')
        if order_type == 'active':
            order = Order.objects.filter(order_status=2, created_at__lt=today_start)
        else:
            order = Order.objects.filter(created_at__gte=today_start)
        self.queryset = Package.objects.filter(orderdetails__order__in=order).distinct()

        return self.queryset


class StatusUpdateView(LoginRequiredMixin, TemplateView):
    # permission_required = 'applications.view_application'
    template_name = 'sales/order/status_update.html'

    def get_context_data(self, **kwargs):
        order = Order.objects.filter(id=self.kwargs['order_id']).first()
        order_log = OrderActivityLog.objects.filter(order=order)
        file_status = ORDER_STATUS
        context = {
            'application': order,
            'file_status': file_status,
            'order_log': order_log
        }
        return context


class OrderInvoiceView(LoginRequiredMixin, TemplateView):
    # permission_required = 'applications.view_application'
    template_name = 'sales/order/invoice/invoice3.html'

    def get_context_data(self, **kwargs):
        order = Order.objects.filter(id=self.kwargs['order_id']).first()
        order_details = OrderDetails.objects.filter(order=order)
        order_details_package = order_details.filter(package__isnull=False)
        order_details_product = order_details.filter(product__isnull=False)
        total_amount = order_details.aggregate(total=Sum('total_price'))
        order_log = OrderActivityLog.objects.filter(order=order)
        file_status = ORDER_STATUS
        context = {
            'order': order,
            'order_details': order_details,
            'order_details_product': order_details_product,
            'order_details_package': order_details_package,
            'total_amount': total_amount,
            'file_status': file_status
        }
        return context


class StatusUpdateViewSet(viewsets.ModelViewSet):
    http_method_names = ['post']
    queryset = OrderActivityLog.objects.all()
    serializer_class = OrderActivityLogSerializer

    def create(self, request, *args, **kwargs):
        user_data = request.data
        order_id = user_data.get('order', None)
        status = user_data.get('status', None)
        order = Order.objects.filter(id=order_id).first()
        if not order:
            raise ValidationError({'error': 'Invalid Order.'})
        serializer = self.get_serializer(data=user_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        order.order_status = status
        order.save()
        
        return Response({})

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ZoneOrderList(TemplateView):
    template_name = 'sales/order/zone_order.html'


class ZoneOrderViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneOrderSerializer

    def get_serializer_context(self):
        return self.request.query_params


class ActiveOrderInvoiceList(PDFTemplateView):
    template_name = 'sales/order/invoice/order_invoice.html'
    now = datetime.now()
    date_time = now.strftime("%d-%m-%Y, %H-%M")
    filename = str(date_time) + '.pdf'

    def get_context_data(self, **kwargs):
        context = {}
        order_list = Order.objects.filter(order_status=2, created_at__lt=today_start)
        zone = self.request.GET.get('zone', None)
        print(zone, "Zone")
        if zone:
            try:
                order_list = order_list.filter(zone=zone)
            except:
                pass
        context['order_list'] = order_list

        return context
