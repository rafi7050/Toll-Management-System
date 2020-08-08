from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from api.order.serializers import OrderSerializer
from apps.sales.models import Order


class ClientOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.none()
    serializer_class = OrderSerializer

    authentication_classes = (TokenAuthentication,)  # Add this line
    permission_classes = (IsAuthenticated,)  # Add this line

    def get_queryset(self):
        self.queryset = Order.objects.filter(customer=self.request.user)
        return self.queryset
