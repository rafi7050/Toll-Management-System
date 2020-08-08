from functools import wraps

from django.contrib.auth.mixins import AccessMixin
from django.core.exceptions import PermissionDenied
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings


class MailSend:

    def __init__(self):
        self.from_email = settings.EMAIL_HOST_USER

    def sending_mail(self, *args, **kwargs):
        subject = 'Your Subject'
        to = kwargs['to']
        from_email = self.from_email
        message = render_to_string('email/email.html', kwargs['ctx'])
        msg = EmailMessage(subject, message, to=to, from_email=from_email)
        msg.content_subtype = 'html'
        msg.send()
        return 'Submitted Successfully'


class PassRequestToFormViewMixin:
    def get_form_kwargs(self):
        kwargs = super(PassRequestToFormViewMixin, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs


class StaffRequiredMixin(AccessMixin):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return self.handle_no_permission()
        return super().dispatch(request, *args, **kwargs)


class SubdomainMixin(AccessMixin):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            if request.sdomain != request.user.userprofile.institute:
                return self.handle_no_permission()
        return super().dispatch(request, *args, **kwargs)


phone_numbers = ['013', '014', '015', '016', '017', '018', '019']