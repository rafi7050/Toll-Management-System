from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Div, Row, Column, Button, Submit, HTML, Field
from django import forms
from django.forms import inlineformset_factory

from apps.helpers.function import get_customer, get_package
from apps.sales.layouts import Formset as OrderDetailsFormsetLayout
from apps.sales.models import Order, OrderDetails


class OrderForm(forms.ModelForm):
    latitude = forms.CharField(widget=forms.HiddenInput())
    longitude = forms.CharField(widget=forms.HiddenInput())
    customer = get_customer()

    class Meta:
        model = Order
        fields = ['customer', 'mobile_number', 'address_line_1', 'address_line_2', 'place', 'zip', 'total_amount',
                  'zone', 'latitude', 'longitude']

    def __init__(self, *args, **kwargs):
        super(OrderForm, self).__init__(*args, **kwargs)
        self.fields['total_amount'].widget.attrs['readonly'] = True
        self.fields['zone'].widget.attrs['readonly'] = True
        self.fields['latitude'].widget.attrs['readonly'] = True
        self.fields['longitude'].widget.attrs['readonly'] = True
        self.helper = FormHelper()
        self.helper.form_tag = True
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-md-3 create-label'
        self.helper.field_class = 'col-md-9'
        self.helper.layout = Layout(

            Div(
                OrderDetailsFormsetLayout('order_details')
            ),
            Row(
                Column('total_amount', css_class='form-group col-md-6 mb-0 order_form'),
            ),
            HTML("<hr/>"),
            Row(
                Column('customer', css_class='form-group col-md-6 mb-0 order_form'),
                Column('mobile_number', css_class='form-group col-md-6 mb-0 order_form'),
                Column('address_line_1', css_class='form-group col-md-6 mb-0 order_form'),
                Column('address_line_2', css_class='form-group col-md-6 mb-0 order_form'),
                Column(
                    Field('place'),
                    Field('latitude'),
                    Field('longitude'),
                    css_class='form-group col-md-6 mb-0 order_form'
                ),
                Column('zip', css_class='form-group col-md-6 mb-0 order_form'),
                Column('zone', css_class='form-group col-md-6 mb-0 order_form'),

            ),
            HTML("<hr/>"),
            Row(
                Column(
                    Button('cancel', 'Cancel', css_class='btn-danger', onclick="window.history.back()"),
                    css_class='text-right col'
                ),
                Column(
                    Submit('submit', 'Submit')
                ),
            )
        )


class OrderDetailsForm(forms.ModelForm):
    package = get_package()

    class Meta:
        model = OrderDetails
        fields = ['package', 'price', 'quantity', 'total_price']

    def __init__(self, *args, **kwargs):
        instance = kwargs.get('instance',None)

        super(OrderDetailsForm, self).__init__(*args, **kwargs)
        self.fields['total_price'].widget.attrs['readonly'] = True
        self.fields['price'].widget.attrs['readonly'] = True

        if instance:
            self.fields['package'] = get_package(instance)

OrderDetailsFormset = inlineformset_factory(
    Order, OrderDetails, form=OrderDetailsForm, fields=['package', 'price', 'quantity', 'total_price'], extra=1,
    can_delete=True
)

OrderDetailsUpdateFormset = inlineformset_factory(
    Order, OrderDetails, form=OrderDetailsForm, fields=['package', 'price', 'quantity', 'total_price'], extra=0,
    can_delete=True
)
