from django.db import transaction
from django.shortcuts import render

# Create your views here.
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework_datatables.filters import DatatablesFilterBackend
from shapely.geometry import Point, Polygon

from apps.location_service.models import Zone
from apps.packages.forms import PackageForm, PackageProductFormSet, PackageProductFormSetUpdate
from apps.packages.models import Package
from apps.packages.serializers import PackageSerializer


class PackageListView(TemplateView):
    queryset = Package.objects.all()
    template_name = 'packages/list.html'


class PackageCreateView(CreateView):
    model = Package
    form_class = PackageForm
    template_name = 'packages/create.html'
    success_url = reverse_lazy('package_list')

    def get_context_data(self, **kwargs):
        data = super(PackageCreateView, self).get_context_data(**kwargs)
        if self.request.POST:
            data['package_product'] = PackageProductFormSet(self.request.POST)
        else:
            data['package_product'] = PackageProductFormSet()
        return data

    # def form_valid(self, form):
    #     if form.is_valid():
    #         post = form.save(commit=False)
    #         post.created_by = self.request.user
    #         post.save()
    #     return super().form_valid(form)

    def form_valid(self, form):
        context = self.get_context_data()
        titles = context['package_product']
        with transaction.atomic():
            form.instance.created_by = self.request.user
            self.object = form.save()
            if titles.is_valid():
                titles.instance = self.object
                titles.save()
        return super(PackageCreateView, self).form_valid(form)


class PackageEditView(UpdateView):
    model = Package
    form_class = PackageForm
    template_name = 'packages/create.html'
    success_url = reverse_lazy('package_list')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        if self.request.POST:
            data['package_product'] = PackageProductFormSetUpdate(self.request.POST, instance=self.object)
        else:
            data['package_product'] = PackageProductFormSetUpdate(instance=self.object)
        return data

    def form_valid(self, form):
        context = self.get_context_data()
        titles = context['package_product']
        with transaction.atomic():
            form.instance.created_by = self.request.user
            self.object = form.save()
            if titles.is_valid():
                titles.instance = self.object

                titles.save()
        return super(PackageEditView, self).form_valid(form)


class PackageDeleteView(DeleteView):
    model = Package
    template_name = 'delete_confirm.html'
    success_url = reverse_lazy('package_list')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

    filter_backends = (DjangoFilterBackend, DatatablesFilterBackend)


class ProductToPackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.none()
    serializer_class = PackageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
