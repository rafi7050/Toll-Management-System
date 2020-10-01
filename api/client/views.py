from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from api.client.serializers import UserSerializer
from apps.accounts.models import UserProfile
from apps.helpers.otp import OTPGenerate


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
                raise ValidationError({'error': 'This phone is already in use'})
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        otp = OTPGenerate.token(self, user_data.get('mobile', None))
        return Response(serializer.data)

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.set_password(instance.password)
        # UserProfile.objects.create(user=instance,user_type=2)
        instance.userprofile.user_type = 2
        instance.save()


class Logout(APIView):
    queryset = User.objects.none()
    authentication_classes = (TokenAuthentication,)  # Add this line
    permission_classes = (IsAuthenticated,)  # Add this line

    def get(self, request, format=None):
        # simply delete the token to force a login
        try:
            Token.objects.filter(user=request.user.id, key=request.auth.key).first().delete()
            return Response(status=status.HTTP_200_OK, data={'Successfully Logout.'})
        except:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response({})


class CustomerLogin(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        if user.is_staff:
            raise ValidationError('Unable to log in with provided credentials')
        if not user.is_active:
            raise ValidationError('Your account is not active.')
        token, created = Token.objects.get_or_create(user=user)
        user_data = UserSerializer(user).data
        return Response(user_data)


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
        self.mail_send(user, otp)
        return Response({'Otp Generate Successfully'})

    def mail_send(self, user, otp):
        # name = user.get_full_name()
        receiver = user.email
        email = 'support@aamartaka.com'
        subject = 'Dailyshobji Password Reset'
        message = 'Your password reset code ' + str(otp)

        success = send_mail(
            subject,
            message,
            from_email=email,
            recipient_list=[receiver],
            fail_silently=False
        )
        return True


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
