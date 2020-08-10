import base64

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.contrib.auth.models import User, Group
from django.contrib.auth.views import LoginView
from django.contrib.messages.views import SuccessMessageMixin
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.urls import reverse_lazy

from django.views import View
from django.views.generic import DetailView, ListView, CreateView, UpdateView, DeleteView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_datatables.filters import DatatablesFilterBackend

from . import forms, serializers
from apps.accounts.forms import CustomAuthenticationForm

from django.contrib.auth import login as auth_login, logout

# Create your views here.
from apps.accounts.models import UserProfile
from apps.accounts.serializers import UserSerializer
from apps.accounts.utils import PassRequestToFormViewMixin, SubdomainMixin
from apps.helpers.otp import OTPGenerate


class LogoutView(View):

    def get(self, request):
        response = logout(request)
        response = HttpResponseRedirect('/accounts/login/')
        response.delete_cookie('un')
        return response


class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm

    def render_to_response(self, context, **response_kwargs):
        response = super(CustomLoginView, self).render_to_response(context, **response_kwargs)
        cookies = self.request.COOKIES

        # if cookies.get('un'):
        #     return HttpResponseRedirect('/accounts/lock/')
        return response

    def form_valid(self, form):
        username = form.cleaned_data['username']
        user = User.objects.get(username=username)

        # if self.request.sdomain != user.userprofile.institute:
        #     raise PermissionDenied
        auth_login(self.request, form.get_user())

        response = HttpResponseRedirect(self.get_success_url())
        username = self.request.user.username
        encoded = base64.b64encode(username.encode())
        response.set_cookie('un', encoded.decode(), 7200)  # 2 Hours
        return response

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context['domain'] = Institute.objects.get(sdomain=self.request.sdomain.sdomain)
        return context

    # def get_redirect_url(self):
    #     if self.request.user.groups.filter(name__icontains='seo'):
    #         return reverse_lazy('seo_list')
    #     else:
    #         url = self.get_redirect_url()
    #         return url or resolve_url(settings.LOGIN_REDIRECT_URL)


class CustomLockView(LoginView):

    def get_context_data(self, **kwargs):
        logout(self.request)
        context = super().get_context_data(**kwargs)
        # context['domain'] = Institute.objects.get(sdomain=self.request.sdomain.sdomain)
        cookies = self.request.COOKIES
        un = cookies.get('un', False)
        if un:
            username = base64.b64decode(un.encode())
            username = username.decode()
            user = User.objects.get(username=username)
        else:
            user = None

        context['user'] = user
        return context


class RegisterViewSet(viewsets.ModelViewSet):
    http_method_names = ['post']
    queryset = User.objects.none()
    serializer_class = UserSerializer

    authentication_classes = ()  # Add this line
    permission_classes = ()  # Add this line

    def create(self, request, *args, **kwargs):
        user_data = request.data
        data = {
            'username': user_data.get('mobile', None),
            'email': user_data.get('email', None),
            'first_name': user_data.get('name', None),
            'password': user_data.get('password', None),
            'password2': user_data.get('password2', None),
        }
        if user_data.get('mobile', None):
            if User.objects.filter(username=user_data.get('mobile', None)).exists():
                raise ValidationError({'error': 'This prone is already in use'})
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        otp = OTPGenerate.token(self, user_data.get('mobile', None))
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save()


class OtpResend(APIView):
    authentication_classes = ()  # Add this line
    permission_classes = ()  # Add this line

    def get(self, request):
        mobile_no = self.request.query_params.get('mobile', None)

        if mobile_no is None:
            raise ValidationError({'error': 'Please provide your mobile number.'})
        user = User.objects.filter(username=mobile_no).first()
        if user is None:
            raise ValidationError({'error': 'You have to register first.'})
        otp = OTPGenerate.token(self, mobile_no)

        return Response({'Otp Generate Successfully'})


class PasswordReset(APIView):
    authentication_classes = ()  # Add this line
    permission_classes = ()  # Add this line

    def post(self, request):
        mobile_no = self.request.data.get('mobile', None)
        password = self.request.data.get('password', None)
        otp = self.request.data.get('otp', None)

        if mobile_no is None:
            raise ValidationError({'error': 'Please provide your mobile number.'})

        if password is None:
            raise ValidationError({'error': 'Please provide your new password.'})

        if otp is None:
            raise ValidationError({'error': 'Please provide your otp'})

        user = User.objects.filter(username=mobile_no).first()

        if user is None:
            raise ValidationError({'error': 'Please provide your valid mobile number.'})

        if user.userprofile.otp is None:
            raise ValidationError({'error': 'You have to request for reset password first.'})

        token = user.userprofile.otp

        if not str(otp) == str(token):
            raise ValidationError({'error': 'Please provide valid OTP.'})

        data = {
            'username': mobile_no,
            'password': password
        }
        serializer = UserSerializer(data=data, instance=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'Password reset successfully.'})


# User Related


class UserListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    permission_required = 'auth.view_user'
    model = UserProfile
    template_name = 'accounts/user/list.html'
    context_object_name = 'users'

    def get_queryset(self):
        queryset = UserProfile.objects.filter(user__is_staff=True).exclude(user__is_superuser=True).select_related(
            'user').prefetch_related('user__groups')
        return queryset


class UserCreateView(LoginRequiredMixin, PermissionRequiredMixin, PassRequestToFormViewMixin, CreateView):
    permission_required = 'auth.add_user'
    form_class = forms.UserCreateMultiForm
    template_name = 'accounts/user/add.html'
    success_url = reverse_lazy('user_list')

    def form_valid(self, form):
        # Save the user first, because the profile needs a user before it
        # can be saved.
        user = form['user'].save(commit=False)
        user.is_staff = True
        user.save()
        form['user'].save_m2m()
        if self.request.user.is_superuser:
            user.is_staff = True

        profile = form['profile'].save(commit=False)

        profile.user = user
        # profile.institute = self.request.user.userprofile.institute
        profile.created_by = self.request.user
        profile.updated_by = self.request.user
        profile.save()
        return super(UserCreateView, self).form_valid(form)


class UserUpdateView(LoginRequiredMixin, PermissionRequiredMixin, PassRequestToFormViewMixin, UpdateView):
    permission_required = 'auth.change_user'
    model = User
    form_class = forms.UserUpdateMultiForm
    template_name = 'accounts/user/update.html'
    success_url = reverse_lazy('user_list')

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()

        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)

    def get_form_kwargs(self):
        kwargs = super(UserUpdateView, self).get_form_kwargs()
        kwargs.update(instance={
            'user': self.object,
            'profile': self.object.userprofile,
        })
        return kwargs

    def form_valid(self, form):
        return super(UserUpdateView, self).form_valid(form)


class UserDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    permission_required = 'auth.delete_user'
    model = User
    template_name = 'delete_confirm.html'
    success_url = reverse_lazy('user_list')

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)


class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    template_name = 'accounts/profile.html'
    context_object_name = 'user'

    def get_context_data(self, **kwargs):
        context = super(UserDetailView, self).get_context_data(**kwargs)

        return context

    def get_object(self, queryset=None):
        return self.request.user


# Group Related


class GroupListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    permission_required = 'auth.view_group'
    model = Group
    template_name = 'accounts/team/list.html'
    context_object_name = 'groups'

    def get_queryset(self):
        queryset = Group.objects.all().select_related('groupprofile')
        return queryset


class GroupCreateView(LoginRequiredMixin, PermissionRequiredMixin, PassRequestToFormViewMixin, SuccessMessageMixin,
                      CreateView):
    permission_required = 'auth.add_group'
    form_class = forms.GroupMultiForm
    template_name = 'accounts/team/add.html'
    success_url = reverse_lazy('team_list')
    success_message = "Requested team added successfully"

    def form_valid(self, form):
        # Save the user first, because the profile needs a user before it
        # can be saved.
        group = form['group'].save()
        profile = form['profile'].save(commit=False)
        profile.name = group
        # institute = self.request.user.userprofile.institute
        profile.created_by = self.request.user
        profile.updated_by = self.request.user
        # profile.institute = institute
        profile.save()
        return super(GroupCreateView, self).form_valid(form)


class GroupUpdateView(PassRequestToFormViewMixin, PermissionRequiredMixin, SuccessMessageMixin, UpdateView):
    permission_required = 'auth.change_group'
    model = Group
    form_class = forms.GroupMultiForm
    template_name = 'accounts/team/add.html'
    success_url = reverse_lazy('team_list')
    success_message = "Requested team updated successfully"

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)

    def get_form_kwargs(self):
        kwargs = super(GroupUpdateView, self).get_form_kwargs()
        kwargs.update(instance={
            'group': self.object,
            'profile': self.object.groupprofile,
        })
        return kwargs


class GroupDeleteView(LoginRequiredMixin, PermissionRequiredMixin, SuccessMessageMixin, DeleteView):
    permission_required = 'auth.delete_group'
    model = Group
    template_name = 'delete_confirm.html'
    success_url = reverse_lazy('team_list')
    success_message = "%(name)s was deleted successfully"

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        # if self.request.user.userprofile.institute.id != 1 and self.object.groupprofile.institute.id != self.request.user.userprofile.institute.id:
        #     raise Http404()
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()
        messages.success(self.request, self.success_message % obj.__dict__)
        return super(GroupDeleteView, self).delete(request, *args, **kwargs)


# Customer Related

class CustomerListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    permission_required = 'auth.view_user'
    model = UserProfile
    template_name = 'accounts/customer/list.html'
    context_object_name = 'customers'
    queryset = UserProfile.objects.filter(user_type=2,user__is_staff=False)



class CustomerCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    permission_required = 'auth.add_user'
    form_class = forms.CustomerCreateMultiForm
    template_name = 'accounts/customer/add.html'
    success_url = reverse_lazy('customer_list')

    def form_valid(self, form):
        user = form['user'].save()
        profile = form['profile'].save(commit=False)
        profile.user = user
        profile.save()
        return super(CustomerCreateView, self).form_valid(form)


class CustomerUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    permission_required = 'auth.change_user'
    model = User
    form_class = forms.CustomerCreateMultiForm
    template_name = 'accounts/customer/add.html'
    success_url = reverse_lazy('customer_list')

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()

        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)

    def get_form_kwargs(self):
        kwargs = super(CustomerUpdateView, self).get_form_kwargs()
        kwargs.update(instance={
            'user': self.object,
            'profile': self.object.userprofile,
        })
        return kwargs


class CustomerDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    permission_required = 'auth.delete_user'
    model = User
    template_name = 'delete_confirm.html'
    success_url = reverse_lazy('customer_list')

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()

        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)


class CustomerDetailsView(LoginRequiredMixin, PermissionRequiredMixin, DetailView):
    permission_required = 'auth.view_user'
    model = User
    template_name = 'accounts/customer/details.html'
    context_object_name = 'customer'



class CustomerViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.filter(user__is_staff=False,user_type=2)
    serializer_class = serializers.UserProfileSerializer
    filter_backends = (DatatablesFilterBackend, DjangoFilterBackend, SearchFilter)
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')
    filter_fields = ['user__groups', 'location']

