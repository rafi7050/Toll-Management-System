from betterforms.multiform import MultiModelForm
from crispy_forms.bootstrap import PrependedText, AppendedText, PrependedAppendedText
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Row, Column, Submit
from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, UsernameField, SetPasswordForm
from django.contrib.auth.models import User, Permission, Group
from django.core.exceptions import ValidationError
from django.db.models import Q
from django.utils.safestring import mark_safe

from apps.accounts.models import UserProfile, GroupProfile, UserAvailability
from apps.accounts.utils import phone_numbers

from tabular_permissions.widgets import TabularPermissionsWidget

from django.contrib.auth.forms import PasswordResetForm


class EmailValidationOnForgotPassword(PasswordResetForm):

    def clean_email(self):
        email = self.cleaned_data['email']
        # if not User.objects.filter(email__iexact=email, is_active=True).exists():
        #     msg = "Sorry you are not a registered user"
        #     self.add_error('email', msg)
        return email


class TokenRemoveSetPasswordForm(SetPasswordForm):
    def save(self, commit=True):
        password = self.cleaned_data["new_password1"]
        self.user.set_password(password)
        if commit:
            self.user.save()
            try:
                self.user.auth_token.delete()
            except:
                pass
        return self.user


class GroupForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        user = self.request.user
        super(GroupForm, self).__init__(*args, **kwargs)
        if self.initial:
            self.initial['name'] = self.initial['name'].split('-')[1]
        if user.is_superuser:
            permission = Permission.objects.all()
        else:
            permission = Permission.objects.filter(Q(group__user=user) | Q(user=user)).distinct()
        self.fields['permissions'].widget = TabularPermissionsWidget(verbose_name='perm', is_stacked=False,
                                                                     permission=permission)

    # def clean_name(self):
    #     name = self.cleaned_data['name']
    #     except_list = ['www', 'admin']
    #     if '-' in name:
    #         raise ValidationError('Hyphen/Dash is not allowed', code='invalid')
    #     sdomain = self.request.sdomain.sdomain.split('.')[0]
    #     if sdomain in except_list:
    #         sdomain = 'bcbd'
    #     if sdomain in name:
    #         data = name
    #     else:
    #         data = sdomain + "-" + name
    #     return data


class GroupProfileForm(forms.ModelForm):
    class Meta:
        model = GroupProfile
        exclude = ['name', 'institute', 'created_by', 'updated_by', 'created_at', 'updated_at']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(GroupProfileForm, self).__init__(*args, **kwargs)
        self.fields['can_view_dashboard'].widget.attrs['class'] = 'checkbox'


class GroupMultiForm(MultiModelForm):
    form_classes = {
        'group': GroupForm,
        'profile': GroupProfileForm,
    }

    def get_form_args_kwargs(self, key, args, kwargs):
        fargs, fkwargs = super(GroupMultiForm, self).get_form_args_kwargs(key, args, kwargs)
        fkwargs.update({'request': kwargs.get('request')})
        return fargs, fkwargs


class GroupEditMultiForm(MultiModelForm):
    form_classes = {
        'group': GroupForm,
        'profile': GroupProfileForm,
    }

    def get_form_args_kwargs(self, key, args, kwargs):
        fargs, fkwargs = super(GroupEditMultiForm, self).get_form_args_kwargs(key, args, kwargs)
        fkwargs.update({'request': kwargs.get('request')})
        return fargs, fkwargs


# ----------------------------------- End ---------------------------
# -----------------------User Part Start -------------------
class UserCreateForm(UserCreationForm):
    # username = forms.CharField(label="Mobile No")

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2', 'groups']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(UserCreateForm, self).__init__(*args, **kwargs)
        self.fields['groups'].queryset = Group.objects.all()

    def clean_email(self):
        email = self.cleaned_data.get('email')
        # username = self.cleaned_data.get('username')
        # if email and User.objects.filter(email=email).exclude(username=username).exists():
        #     raise forms.ValidationError('A user with that email address already exist')
        return email


class UserProfileCreateForm(forms.ModelForm):
    # dob = forms.CharField(widget=forms.TextInput(attrs={'class': 'datepicker'}), label='Date Of Birth')

    can_see_dashboard = forms.ChoiceField(choices=((True, 'Yes'), (False, 'No')), label="Can See Dashboard", initial='',
                                          widget=forms.Select(), required=True)

    class Meta:
        model = UserProfile
        exclude = ['user', 'created_by', 'updated_by', 'created_at', 'updated_at', 'is_institute_admin', 'institute',
                   'status', 'remarks', 'call_time', 'dob']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(UserProfileCreateForm, self).__init__(*args, **kwargs)


TRUE_FALSE_CHOICES = (
    (True, 'Yes'),
    (False, 'No')
)


class UserProfileUpdateForm(forms.ModelForm):
    dob = forms.CharField(widget=forms.TextInput(attrs={'class': 'datepicker'}), label='Date Of Birth')
    can_see_dashboard = forms.ChoiceField(choices=((True, 'Yes'), (False, 'No')), label="Can See Dashboard", initial='',
                                          widget=forms.Select(), required=True)
    is_team_leader = forms.ChoiceField(choices=TRUE_FALSE_CHOICES, label="Team Leader",
                                       initial='', widget=forms.Select(), required=False)

    class Meta:
        model = UserProfile
        exclude = ['user', 'created_by', 'updated_by', 'created_at', 'updated_at', 'is_institute_admin', 'institute',
                   'status', 'remarks', 'call_time']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(UserProfileUpdateForm, self).__init__(*args, **kwargs)


class UserCreateMultiForm(MultiModelForm):
    # application_bank = get_institute_query()
    form_classes = {
        'user': UserCreateForm,
        'profile': UserProfileCreateForm,
    }

    def get_form_args_kwargs(self, key, args, kwargs):
        fargs, fkwargs = super(UserCreateMultiForm, self).get_form_args_kwargs(key, args, kwargs)
        fkwargs.update({'request': kwargs.get('request')})
        return fargs, fkwargs


class UserUpdateForm(forms.ModelForm):
    # username = forms.CharField(label="Mobile No")

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'groups']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(UserUpdateForm, self).__init__(*args, **kwargs)
        self.fields['groups'].queryset = Group.objects.filter(
            groupprofile__institute=self.request.user.userprofile.institute)
        self.initial['groups'] = self.initial['groups']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        # username = self.cleaned_data.get('username')
        # if email and User.objects.filter(email=email).exclude(username=username).exists():
        #     raise forms.ValidationError('A user with that email address already exist')
        return email


class UserUpdateMultiForm(MultiModelForm):
    # application_bank = get_institute_query()
    form_classes = {
        'user': UserUpdateForm,
        'profile': UserProfileUpdateForm,
    }

    def get_form_args_kwargs(self, key, args, kwargs):
        fargs, fkwargs = super(UserUpdateMultiForm, self).get_form_args_kwargs(key, args, kwargs)
        fkwargs.update({'request': kwargs.get('request')})
        return fargs, fkwargs


# ----------------------------------- End ---------------------------
# -----------------------UserAvailability Part Start -------------------
class UserAvailabilityCreateForm(forms.ModelForm):
    start = forms.CharField(widget=forms.TextInput(attrs={'class': 'datepicker'}), label='From')
    finish = forms.CharField(widget=forms.TextInput(attrs={'class': 'datepicker'}), label='Finish')

    class Meta:
        model = UserAvailability
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(UserAvailabilityCreateForm, self).__init__(*args, **kwargs)
        self.fields['user'].queryset = User.objects.filter(
            userprofile__institute=self.request.user.userprofile.institute, userprofile__is_institute_admin=False)


# ----------------------------------- End ---------------------------
# -----------------------Customer Part Start -------------------


class CustomerCreateForm(forms.ModelForm):
    username = forms.CharField(label="Mobile No")
    first_name = forms.CharField(label='Full Name')
    class Meta:
        model = User
        fields = ['username', 'first_name', 'email']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(CustomerCreateForm, self).__init__(*args, **kwargs)

    def clean_username(self):
        data = self.cleaned_data['username']
        try:
            check = int(data)
        except ValueError:
            raise forms.ValidationError("Enter a valid phone number")
        if '+' in data:
            raise forms.ValidationError("No need to add country code")
        if not data[:3] in phone_numbers:
            raise forms.ValidationError("Enter a valid phone number")
        if len(data) != 11:
            raise forms.ValidationError("Phone number should be 11 digits following zero")
        return data

    def clean_email(self):
        email = self.cleaned_data.get('email')
        # username = self.cleaned_data.get('username')
        # if email and User.objects.filter(email=email).exclude(username=username).exists():
        #     raise forms.ValidationError('A user with that email address already exist')
        return email


class CustomerProfileCreateForm(forms.ModelForm):
    dob = forms.CharField(widget=forms.TextInput(attrs={'class': 'datepicker'}), label='Date Of Birth', required=False)
    # call_time = forms.CharField(widget=forms.TextInput(attrs={'class': 'datetimepicker'}), label='Call Time',
    #                             required=False)

    class Meta:
        model = UserProfile
        exclude = ['user', 'created_by', 'updated_by', 'created_at', 'updated_at', 'is_institute_admin', 'location','status','call_time','remarks','user_type']

    # def clean_call_time(self):
    #     data = self.cleaned_data['call_time']
    #     if not data:
    #         data = None
    #     return data

    def clean_dob(self):
        data = self.cleaned_data['dob']
        if not data:
            data = None
        return data

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(CustomerProfileCreateForm, self).__init__(*args, **kwargs)


class CustomerCreateMultiForm(MultiModelForm):
    form_classes = {
        'user': CustomerCreateForm,
        'profile': CustomerProfileCreateForm,
    }

    def get_form_args_kwargs(self, key, args, kwargs):
        fargs, fkwargs = super(CustomerCreateMultiForm, self).get_form_args_kwargs(key, args, kwargs)
        fkwargs.update({'request': kwargs.get('request')})
        return fargs, fkwargs


class CustomAuthenticationForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_show_labels = False
        self.helper.layout = Layout(
            Row(
                Column(
                    PrependedText('username', '', placeholder="Username"),
                    css_class='form-group col-md-12 mb-0'
                ),
                css_class='form-row'
            ),
            Row(
                Column(
                    PrependedAppendedText('password', '', mark_safe('<i class="fas fa-eye-slash password_view"></i>'), placeholder="Password"),
                css_class='form-group col-md-12 mb-0'
                ),
                css_class='form-row'
            ),
            Submit('submit', 'Login', css_class='btn-lg btn-block submit_button custom-placeholder')
        )
