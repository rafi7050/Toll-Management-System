from rest_framework import viewsets

from apps.products.models import Product
from .serializers import ProductsSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter()
    serializer_class = ProductsSerializer
