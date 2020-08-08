from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.client.serializers import UserSerializer
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
                raise ValidationError({'error': 'This prone is already in use'})
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        otp = OTPGenerate.token(self, user_data.get('mobile', None))
        return Response(serializer.data)


    def perform_create(self, serializer):
        instance = serializer.save()
        instance.set_password(instance.password)
        instance.userprofile.user_type = 2
        instance.save()



class Logout(APIView):
    queryset = User.objects.none()
    authentication_classes = (TokenAuthentication,)  # Add this line
    permission_classes = (IsAuthenticated,)  # Add this line

    def get(self, request, format=None):
        # simply delete the token to force a login
        # print(request)
        # try:
        #     TimedAuthToken.objects.filter(user=request.user.id).first().delete()
        #     return Response(status=status.HTTP_200_OK)
        # except:
        #     return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
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
