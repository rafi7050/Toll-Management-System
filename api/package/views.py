from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.package.serializers import PackageSerializer
from apps.helpers.utils import SIZE
from apps.packages.models import Package
from apps.sales.models import Order


class PackageViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = Package.objects.filter(package_type=1)
    serializer_class = PackageSerializer


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
