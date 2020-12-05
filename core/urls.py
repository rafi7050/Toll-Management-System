  
from django.urls import path
from .views import car_admission, index, car_list, car_details, search
from . import views
app_name = 'core'
urlpatterns = [
     path('', index ,name='index'),
    path('admission_form/', car_admission ,name='car_admission'),
    path('car_list/', car_list ,name='car_list'),
    path('car_details/<int:id>/', car_details ,name='car_details'),
    path('search/', search, name='search'),
    path('register/', views.register, name="register"),
    path('login/', views.login_page, name="login"),
    path('logout/', views.logoutUser, name="logout"),


]