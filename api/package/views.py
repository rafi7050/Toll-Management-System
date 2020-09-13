from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_datatables.filters import DatatablesFilterBackend

from api.package.serializers import PackageSerializer
from apps.helpers.utils import SIZE
from apps.packages.models import Package
from apps.sales.models import Order


class PackageViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = Package.objects.filter(package_type=1)
    serializer_class = PackageSerializer

    filter_backends = (DatatablesFilterBackend, DjangoFilterBackend,)
    filter_fields = {
        'nutrition_point': ['exact'],
        'age_group': ['exact'],
        'size': ['exact'],
    }

    # def get_queryset(self):
    #     nutrition_point = self.request.GET.get('nutrition_point', None)
    #     age_group = self.request.GET.get('age_group', None)
    #     size = self.request.GET.get('size', None)
    #
    #     if nutrition_point:
    #         self.queryset = self.queryset.filter(nutrition_point=nutrition_point)
    #
    #     if age_group:
    #         self.queryset = self.queryset.filter(age_group=age_group)
    #
    #     if size:
    #         self.queryset = self.queryset.filter(size=size)
    #
    #     return self.queryset


class ClientPackageViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = Package.objects.none()
    serializer_class = PackageSerializer

    authentication_classes = (TokenAuthentication,)  # Add this line
    permission_classes = (IsAuthenticated,)  # Add this line

    def get_queryset(self):
        orders = Order.objects.filter(customer=self.request.user).values_list('orderdetails__package', flat=True)
        print(orders)
        self.queryset = Package.objects.filter(id__in=orders)
        return self.queryset


class PackageSizeViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = Package.objects.none()
    serializer_class = PackageSerializer

    def list(self, request, *args, **kwargs):
        package_size = dict(SIZE)
        return Response(package_size)
