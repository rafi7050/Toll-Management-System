from django.urls import path, include

from api.client import views as client
from api.package import views as package
from api.order import views as order

from pricing.urls import client_router

client_router.register(r'signup', client.RegisterViewSet, basename='client_register')
client_router.register(r'package', package.PackageViewSet, basename='public_package')
client_router.register(r'client_package', package.ClientPackageViewSet, basename='client_package')
client_router.register(r'client_order', order.ClientOrderViewSet, basename='client_order_list')

urlpatterns = [
    # path(r'api/user/', views.UserView.as_view()),
    path('login/', client.CustomerLogin.as_view(), name='user_auth'),
    path('logout/', client.Logout.as_view(), name='client_logout'),
    # path('api/tax_token/', TaxTokenCalculator.as_view(), name='tax_token'),
    # path('api/otp_verify/', OTPGenerate.as_view(), name='otp_token'),
    # path('api/otp_regenerate/', views.OtpResend.as_view(), name='otp_token'),
    # path('api/reset_password/', views.PasswordReset.as_view(), name='reset_password'),
    # path('api/order_price_details/', OrderPricing.as_view(), name='get_order_price_details'),
    # path('api/', include('timed_auth_token.urls')),
    # path('', include(client_router.urls)),
]
