import base64

from django.contrib.auth.models import User, Group
from django.contrib.auth.views import LoginView
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect, HttpResponse, Http404

from django.views import View
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.forms import CustomAuthenticationForm

from django.contrib.auth import login as auth_login, logout



# Create your views here.
from apps.accounts.serializers import UserSerializer
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

        if cookies.get('un'):
            return HttpResponseRedirect('/accounts/lock/')
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
            raise ValidationError({'error':'Please provide your mobile number.'})
        user = User.objects.filter(username=mobile_no).first()
        if user is None:
            raise ValidationError({'error':'You have to register first.'})
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
            raise ValidationError({'error':'Please provide your mobile number.'})

        if password is None:
            raise ValidationError({'error':'Please provide your new password.'})

        if otp is None:
            raise ValidationError({'error':'Please provide your otp'})

        user = User.objects.filter(username=mobile_no).first()

        if user is None:
            raise ValidationError({'error':'Please provide your valid mobile number.'})

        if user.userprofile.otp is None:
            raise ValidationError({'error':'You have to request for reset password first.'})

        token = user.userprofile.otp

        if not str(otp) == str(token):
            raise ValidationError({'error':'Please provide valid OTP.'})

        data = {
            'username': mobile_no,
            'password': password
        }
        serializer = UserSerializer(data=data, instance=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'Password reset successfully.'})