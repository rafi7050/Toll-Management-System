from crispy_forms.helper import FormHelper
from django import forms

from apps.products.models import Product, AgeGroup, NutritionPoint, ProductType


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['image','name', 'product_type', 'description', 'price','unit','discount_percentage', 'nutrition']

    def __init__(self, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-md-3'
        self.helper.field_class = 'col-md-8 form-group'
        self.fields['description'].widget.attrs.update({'class': 'tinymce_editor'})
        self.fields['nutrition'].widget.attrs.update({'class': 'tinymce_editor'})


class AgeGroupForm(forms.ModelForm):
    class Meta:
        model = AgeGroup
        fields = ['age_from', 'age_to']

    def __init__(self, *args, **kwargs):
        super(AgeGroupForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-md-3'
        self.helper.field_class = 'col-md-8 form-group'


class NutritionPointForm(forms.ModelForm):
    class Meta:
        model = NutritionPoint
        fields = ['nutrition_point']

    def __init__(self, *args, **kwargs):
        super(NutritionPointForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-md-3'
        self.helper.field_class = 'col-md-8 form-group'

class ProductTypeForm(forms.ModelForm):
    class Meta:
        model = ProductType
        fields = ['name']

    def __init__(self, *args, **kwargs):
        super(ProductTypeForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-md-3'
        self.helper.field_class = 'col-md-8 form-group'
