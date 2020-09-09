from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.db import transaction
from django.db.models import Sum, Count
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
            order_details = OrderDetails.objects.filter(order__order_status__in=[1], order__created_at__lt=today_start)
        else:
            order_details = OrderDetails.objects.filter(order__order_status__in=[1], order__created_at__gte=today_start)
        order_products = order_details.filter(package__packageproduct__product__isnull=False).values(
            'package__packageproduct__quantity', 'package__packageproduct__product').annotate(count=Count('package'))
        order_product_quantity = []
        for item in order_products:
            product_id = item.get('package__packageproduct__product', None)
            product = Product.objects.filter(id=product_id).first()
            quantity = str(item.get('package__packageproduct__quantity', None))
            unit = product.get_unit_display()
            product_size = quantity + ' ' + unit
            single_product = {
                'quantity': item.get('package__packageproduct__quantity', None),
                'count': item.get('count', None),
                'id': product.id,
                'name': product.name,
                'unit': product.get_unit_display(),
                'image': product.image.url,
                'product_size': product_size
            }
            order_product_quantity.append(single_product)

        print(order_product_quantity)
        return Response(order_product_quantity)


class OrderedProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = OrderedProductSerializer


    def get_serializer_context(self):
        return self.request.query_params


class OrderedPackage(LoginRequiredMixin, ListView):
    model = Package
    template_name = 'sales/order/order_packages.html'


class OrderedPackageListViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = OrderedPackageSerializer

    def get_serializer_context(self):
        return self.request.query_params


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
        total_amount = order_details.aggregate(total=Sum('total_price'))
        order_log = OrderActivityLog.objects.filter(order=order)
        file_status = ORDER_STATUS
        context = {
            'order': order,
            'order_details': order_details,
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


class ActiveOrderInvoiceList(TemplateView):
    template_name = 'sales/order/invoice/order_invoice.html'

    def get_context_data(self, **kwargs):
        context = {}
        order_list = Order.objects.filter(order_status=2, created_at__lt=today_start)
        context['order_list'] = order_list
        return context
