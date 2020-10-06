import pytz
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.views.generic import TemplateView
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
import datetime

from calendar import monthrange
from django.contrib.auth.models import Group, User

from apps.accounts.models import UserProfile
from apps.packages.models import Package
from apps.products.models import Product
from apps.sales.models import Order

PRODUCT_TYPE = (
    (1, 'Credit Card'),
    (2, 'Personal Loan'),
    (3, 'Home Loan'),
    (4, 'Car Loan')
)
PRODUCT_TYPE_WOORI = (
    (2, 'Personal Loan'),
    (3, 'Home Loan'),
    (4, 'Car Loan')
)


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['Orders'] = Order.objects.count()
        context['Products'] = Product.objects.count()
        context['Packages'] = Package.objects.count()
        context['Customers'] = UserProfile.objects.filter(user_type=2).count()

        return context
