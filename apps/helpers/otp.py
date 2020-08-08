from random import sample

from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView


class OTPGenerate(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        return Response(self.token_verify(request))

    def token(self, mobile):
        user = User.objects.filter(username=mobile).first()
        otp = ''.join(sample('0123456789', 6))
        if user:
            user.userprofile.otp = otp
            user.save()
            # send_otp_sms(COUNTRY_CODE + str(mobile), otp)
        else:
            raise ValidationError('User not exist')
        return otp

    def token_verify(self, request):
        mobile = request.query_params.get('mobile')
        otp = request.query_params.get('otp')

        user = User.objects.filter(username=mobile).first()
        if user:
            token = user.userprofile.otp

            if token:
                if str(token) == str(otp):
                    user.is_active = True
                    user.userprofile.otp = None
                    user.save()
                    return True

        return False