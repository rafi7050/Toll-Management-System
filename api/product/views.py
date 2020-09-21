from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from api.product.serializers import AgeGroupSerializer, NutritionPointSerializer
from apps.products.models import Product, NutritionPoint, AgeGroup
from .serializers import ProductsSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter()
    serializer_class = ProductsSerializer


class NutritionPointViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = NutritionPoint.objects.all()
    serializer_class = NutritionPointSerializer


class AgeGroupViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = AgeGroup.objects.all()
    serializer_class = AgeGroupSerializer
    pagination_class = None




