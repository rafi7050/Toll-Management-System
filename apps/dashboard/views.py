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