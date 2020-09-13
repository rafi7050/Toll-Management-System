from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Div, Field, Fieldset, HTML, ButtonHolder, Submit, Row, Column, Button
from django import forms
from django.forms import inlineformset_factory

from apps.packages.form_set import Formset
from apps.packages.models import Package, PackageProduct


class PackageForm(forms.ModelForm):
    class Meta:
        model = Package
        fields = (
            'name', 'size', 'age_group', 'nutrition_point', 'nutrition_details', 'suggestion', 'discount_percentage')

    def __init__(self, *args, **kwargs):
        super(PackageForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = True
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-md-3 create-label'
        self.helper.field_class = 'col-md-9'
        self.fields['nutrition_details'].widget.attrs.update({'class': 'tinymce_editor'})
        self.helper.layout = Layout(
            Div(
                Field('name'),
                Field('size'),

                Fieldset('Add Product',
                         Formset('package_product')),
                Field('age_group'),
                Field('nutrition_point'),
                Field('nutrition_details'),
                Field('discount_percentage'),
                Field('suggestion'),
                HTML("<hr/>"),
                Row(
                    Column(
                        Button('cancel', 'Cancel', css_class='btn-danger', onclick="window.history.back()"),
                        css_class='text-right col'
                    ),
                    Column(
                        Submit('submit', 'Submit')
                    ),
                    css_class='text-right'
                )
            )
        )


class PackageProductForm(forms.ModelForm):
    class Meta:
        model = PackageProduct
        exclude = ()

    def __init__(self, *args, **kwargs):
        super(PackageProductForm, self).__init__(*args, **kwargs)
        self.fields['product'].widget.attrs.update({'class': 'select2'})


PackageProductFormSet = inlineformset_factory(
    Package, PackageProduct, form=PackageProductForm,
    fields=['product', 'quantity'], extra=1, can_delete=True
)

PackageProductFormSetUpdate = inlineformset_factory(
    Package, PackageProduct, form=PackageProductForm,
    fields=['product', 'quantity'], extra=0, can_delete=True
)
