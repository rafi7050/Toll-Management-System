from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from api.product.serializers import AgeGroupSerializer, NutritionPointSerializer
from apps.products.models import Product, NutritionPoint, AgeGroup, ProductType
from .serializers import ProductsSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter().order_by('priority')
    serializer_class = ProductsSerializer
    pagination_class = None

    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('name','product_type')


class NutritionPointViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = NutritionPoint.objects.all()
    serializer_class = NutritionPointSerializer
    pagination_class = None


class AgeGroupViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = AgeGroup.objects.all()
    serializer_class = AgeGroupSerializer
    pagination_class = None


class ProductTypeViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    pagination_class = None





