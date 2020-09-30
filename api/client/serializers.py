from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from apps.accounts.utils import phone_numbers


class UserSerializer(serializers.ModelSerializer):
    # email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all(), message='A user with that email already exists')],
    #                                required=False)

    token = serializers.SerializerMethodField()

    def get_token(self, obj):
        token = Token.objects.filter(user=obj).first()
        if token:
            return token.key

    class Meta:
        model = User
        # exclude = ['user_permissions', 'groups']
        exclude = ['user_permissions', 'groups', 'date_joined', 'is_superuser', 'last_login', 'is_active', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # def create(self, validated_data):
    #     user = User.objects.create(
    #         username=validated_data['username'],
    #         first_name=validated_data['first_name'],
    #         email=validated_data['email'],
    #         is_staff=False,
    #         is_active=False
    #     )
    #     user.set_password(validated_data['password'])
    #     user.userprofile.user_type = 2
    #     user.save()
    #
    #     return user

    def validate(self, data):
        username = data.get('username', None)
        if username and username.isdigit():
            try:
                check = int(username)
            except ValueError:
                raise serializers.ValidationError({
                    "username": ["Enter a valid phone number"],
                })

            if '+' in username:
                raise serializers.ValidationError({
                    "username": ["No need to add country code"],
                })
            if not username[:3] in phone_numbers:
                raise serializers.ValidationError({
                    "username": ["Enter a valid phone number"],
                })
            if len(username) != 11:
                raise serializers.ValidationError({
                    "username": ["Phone number should be 11 digits following zero"],
                })
        return data

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.userprofile.otp = None
        instance.save()

        return instance
