from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_datatables.filters import DatatablesFilterBackend

from apps.helpers.models import get_location_zone
from apps.location_service.models import Zone
from apps.location_service.serializers import ZoneSerializer
from .models import (Division, Upazila)
from django.urls import reverse_lazy
from .serializers import (DivisionSerializer, UpazilaSerializer)
from django.http import HttpResponseRedirect


# Create your views here.


class DivisionCreateView(CreateView):
    model = Division
    fields = ('name',)
    template_name = 'location_service/division/add.html'
    success_url = reverse_lazy('division_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Division"
        context['card_title'] = "Create New Division"
        context['action'] = reverse_lazy('division_list')
        return context


class DivisionListView(ListView):
    model = Division
    template_name = 'location_service/division/list.html'
    context_object_name = 'division'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['model_title'] = "Division"
        return context


class DivisionUpdateView(UpdateView):
    model = Division
    fields = ('name',)
    template_name = 'location_service/division/add.html'
    success_url = reverse_lazy('division_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Division"
        context['card_title'] = "Update Division"
        context['action'] = reverse_lazy('division_list')
        return context


class DivisionDeleteView(DeleteView):
    model = Division
    template_name = 'delete_confirm.html'
    success_url = reverse_lazy('division_list')


class DivisionViewSet(viewsets.ModelViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]

            # check if many is required
            if isinstance(data, list):
                kwargs["many"] = True
        return super(DivisionViewSet, self).get_serializer(*args, **kwargs)


class UpazilaCreateView(CreateView):
    model = Upazila
    fields = ('name', 'division')
    template_name = 'location_service/upazila/add.html'
    success_url = reverse_lazy('upazila_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Upazila"
        context['card_title'] = "Create New Upazila"
        context['action'] = reverse_lazy('upazila_list')
        return context


class UpazilaListView(ListView):
    model = Upazila
    template_name = 'location_service/upazila/list.html'
    context_object_name = 'upazila'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['model_title'] = "Upazila"
        return context


class UpazilaUpdateView(UpdateView):
    model = Upazila
    fields = ('name', 'division')
    template_name = 'location_service/upazila/add.html'
    success_url = reverse_lazy('upazila_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Upazila"
        context['card_title'] = "Update Upazila"
        context['action'] = reverse_lazy('upazila_list')
        return context


class UpazilaDeleteView(DeleteView):
    model = Upazila
    template_name = 'delete_confirm.html'
    success_url = reverse_lazy('upazila_list')


class UpazilaViewSet(viewsets.ModelViewSet):
    queryset = Upazila.objects.all().order_by('id')
    serializer_class = UpazilaSerializer
    filter_backends = (DjangoFilterBackend, DatatablesFilterBackend)
    filterset_fields = ('division__name',)

    def get_queryset(self):
        no_page = self.request.query_params.get('no_page', None)
        if no_page == 'true':
            self.pagination_class = None
        return self.queryset

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]

            # check if many is required
            if isinstance(data, list):
                kwargs["many"] = True
        return super(UpazilaViewSet, self).get_serializer(*args, **kwargs)


class ZoneViewSet(viewsets.ModelViewSet):
    permission_required = 'location_service.view_zone'
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer


class LocationZoneAPI(APIView):
    queryset = Zone.objects.none()

    def get(self, request):
        lat = self.request.query_params.get('lat', None)
        lng = self.request.query_params.get('lng', None)

        if lat is None:
            raise ValidationError({'error': 'Location Latitude Missing.'})

        if lng is None:
            raise ValidationError({'error': 'Location Longitude Missing.'})
        print(lat,lng)
        zone = get_location_zone(float(lat), float(lng))

        serializer = ZoneSerializer(zone).data

        return Response(serializer)
