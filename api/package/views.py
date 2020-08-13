from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from api.package.serializers import PackageSerializer
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
