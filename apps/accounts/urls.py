from django.contrib.auth.decorators import login_required
from django.urls import path
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView

from apps.accounts.forms import EmailValidationOnForgotPassword

from . import views as accounts_views
from pricing.urls import router

# router.register(r'profile', accounts_views.UserProfileViewSet)
# router.register(r'customer', accounts_views.CustomerViewSet)
# router.register(r'user', accounts_views.UserViewSet)
# router.register(r'group', accounts_views.GroupProfileViewSet)
router.register(r'register', accounts_views.RegisterViewSet)

urlpatterns = [
    # ACCOUNT MANAGEMENT
    # path('user/add/', accounts_views.UserCreateView.as_view(), name='user_add'),
    # path('user/', accounts_views.UserListView.as_view(), name='user_list'),
    # path('user/<int:pk>/update/', accounts_views.UserUpdateView.as_view(), name='user_update'),
    # path('user/<int:pk>/delete/', accounts_views.UserDeleteView.as_view(), name='user_delete'),
    path('profile/', accounts_views.UserDetailView.as_view(), name='user_profile'),


    # path('customer/', accounts_views.CustomerListView.as_view(), name='customer_list'),
    # path('customer/add/', accounts_views.CustomerCreateView.as_view(), name='customer_create'),
    # path('customer/<int:pk>/update/', accounts_views.CustomerUpdateView.as_view(), name='customer_update'),
    # path('customer/<int:pk>/delete/', accounts_views.CustomerDeleteView.as_view(), name='customer_delete'),
    # path('customer/<int:pk>/view/', accounts_views.CustomerDetailsView.as_view(), name='customer_view'),


    path('login/', accounts_views.CustomLoginView.as_view(template_name='accounts/login.html'), name='login'),
    path('lock/', accounts_views.CustomLockView.as_view(template_name='accounts/lock.html'), name='lock'),
    # path('login/', accounts_views.login_view, name='login'),
    path('logout/', accounts_views.LogoutView.as_view(), name='logout'),

    path('password_change/', login_required(auth_views.PasswordChangeView.as_view(
        template_name='accounts/password_change.html'
    )), name='password_change'),
    path('password_change/done/', login_required(auth_views.PasswordChangeDoneView.as_view(
        template_name='accounts/password_change_done.html'
    )), name='password_change_done'),

    path('reset/', auth_views.PasswordResetView.as_view(
        form_class=EmailValidationOnForgotPassword,
        template_name='accounts/password_reset.html',
        email_template_name='email/password_reset_email.html',
        subject_template_name='email/password_reset_subject.txt'
    ), name='password_reset'),
    path('reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='accounts/password_reset_done.html'
    ), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='accounts/password_reset_confirm.html'
    ), name='password_reset_confirm'),
    path('reset/complete/', auth_views.PasswordResetCompleteView.as_view(
        template_name='accounts/password_reset_complete.html'
    ), name='password_reset_complete'),

    # role
    # path('team/add/', accounts_views.GroupCreateView.as_view(), name='team_add'),
    # path('team/<int:pk>/update/', accounts_views.GroupUpdateView.as_view(), name='team_update'),
    # path('team/<int:pk>/delete/', accounts_views.GroupDeleteView.as_view(), name='team_delete'),
    # path('team/', accounts_views.GroupListView.as_view(), name='team_list'),


    # path('send_mail/', accounts_views.testing_customer_mail)

]
