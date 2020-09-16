from crispy_forms.layout import LayoutObject
from crispy_forms.utils import TEMPLATE_PACK
from django.template.loader import render_to_string


class Formset(LayoutObject):
    template = "layouts/default/order_formset.html"

    def __init__(self, formset_name_in_context, template=None):
        print(formset_name_in_context,'formset in context')
        self.formset_name_in_context = formset_name_in_context
        self.fields = []
        if template:
            self.template = template

    def render(self, form, form_style, context, template_pack=TEMPLATE_PACK):
        formset = context[self.formset_name_in_context]
        return render_to_string(self.template, {'formset': formset})