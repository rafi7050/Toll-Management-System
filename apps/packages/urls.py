from django.urls import path

from apps.packages import views
from pricing.urls import router

router.register(r'packages', views.PackageViewSet,basename='package')
urlpatterns = [
    path('', views.PackageListView.as_view(), name='package_list'),
    path('create/', views.PackageCreateView.as_view(), name='package_create'),
    path('edit/<int:pk>', views.PackageEditView.as_view(), name='package_edit'),
    path('delete/<int:pk>', views.PackageDeleteView.as_view(), name='package_delete'),
]
