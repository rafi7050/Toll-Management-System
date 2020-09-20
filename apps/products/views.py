from django import views
from django.shortcuts import render

# Create your views here.
from django.urls import reverse_lazy
from django.views.generic import ListView, TemplateView, CreateView, UpdateView, DeleteView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework_datatables.filters import DatatablesFilterBackend

from apps.products.forms import ProductForm, AgeGroupForm, NutritionPointForm, ProductTypeForm
from apps.products.models import Product, AgeGroup, NutritionPoint, ProductType
from apps.products.serializers import ProductSerializer, AgeGroupSerializer, NutritionPointSerializer, \
    ProductTypeSerializer


class ProductListView(TemplateView):
    queryset = Product.objects.all()
    template_name = 'products/list.html'

class ProductCreateView(CreateView):
    model = Product
    form_class = ProductForm
    template_name = 'products/create.html'
    success_url = reverse_lazy('product_list')

    def form_valid(self, form):
        if form.is_valid():
            post = form.save(commit=False)
            post.created_by = self.request.user
            post.save()
        return super().form_valid(form)

class ProductEditView(UpdateView):
    model = Product
    form_class = ProductForm
    template_name = 'products/create.html'
    success_url = reverse_lazy('product_list')

    def form_valid(self, form):
        if form.is_valid():
            post = form.save(commit=False)
            post.created_by = self.request.user
            post.save()
        return super().form_valid(form)

class ProductDeleteView(DeleteView):
    model = Product
    template_name = 'delete_confirm.html'
    success_url = reverse_lazy('product_list')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    filter_backends = (DjangoFilterBackend, DatatablesFilterBackend)


# Age Group

class AgeGroupListView(TemplateView):
    queryset = AgeGroup.objects.all()
    template_name = 'age_group/list.html'

class AgeGroupCreateView(CreateView):
    model = AgeGroup
    form_class = AgeGroupForm
    template_name = 'age_group/create.html'
    success_url = reverse_lazy('age_group_list')

    def form_valid(self, form):
        if form.is_valid():
            post = form.save(commit=False)
            post.created_by = self.request.user
            post.save()
        return super().form_valid(form)

class AgeGroupEditView(UpdateView):
    model = AgeGroup
    form_class = AgeGroupForm
    template_name = 'age_group/create.html'
    success_url = reverse_lazy('age_group_list')

    def form_valid(self, form):
        if form.is_valid():
            post = form.save(commit=False)
            post.created_by = self.request.user
            post.save()
        return super().form_valid(form)


class AgeGroupViewSet(viewsets.ModelViewSet):
    queryset = AgeGroup.objects.all()
    serializer_class = AgeGroupSerializer

    filter_backends = (DjangoFilterBackend, DatatablesFilterBackend)



# Nutrition Point

class NutritionPointListView(TemplateView):
    queryset = NutritionPoint.objects.all()
    template_name = 'nutrition_point/list.html'

class NutritionPointCreateView(CreateView):
    model = NutritionPoint
    form_class = NutritionPointForm
    template_name = 'nutrition_point/create.html'
    success_url = reverse_lazy('nutrition_point_list')

    def form_valid(self, form):
        if form.is_valid():
            post = form.save(commit=False)
            post.created_by = self.request.user
            post.save()
        return super().form_valid(form)

class NutritionPointEditView(UpdateView):
    model = NutritionPoint
    form_class = NutritionPointForm
    template_name = 'nutrition_point/create.html'
    success_url = reverse_lazy('nutrition_point_list')

    def form_valid(self, form):
        if form.is_valid():
            post = form.save(commit=False)
            post.created_by = self.request.user
            post.save()
        return super().form_valid(form)


class NutritionPointViewSet(viewsets.ModelViewSet):
    queryset = NutritionPoint.objects.all()
    serializer_class = NutritionPointSerializer

    filter_backends = (DjangoFilterBackend, DatatablesFilterBackend)





# Product Type

class ProductTypeListView(TemplateView):
    queryset = ProductType.objects.all()
    template_name = 'product_type/list.html'

class ProductTypeCreateView(CreateView):
    model = ProductType
    form_class = ProductTypeForm
    template_name = 'product_type/create.html'
    success_url = reverse_lazy('product_type_list')

    def form_valid(self, form):
        if form.is_valid():
            post = form.save(commit=False)
            post.created_by = self.request.user
            post.save()
        return super().form_valid(form)

class ProductTypeEditView(UpdateView):
    model = ProductType
    form_class = ProductTypeForm
    template_name = 'product_type/create.html'
    success_url = reverse_lazy('product_type_list')

    def form_valid(self, form):
        if form.is_valid():
            post = form.save(commit=False)
            post.created_by = self.request.user
            post.save()
        return super().form_valid(form)


class ProductTypeViewSet(viewsets.ModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer

    filter_backends = (DjangoFilterBackend, DatatablesFilterBackend)



