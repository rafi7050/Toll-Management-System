from django.urls import path
from apps.location_service import views
from django.urls import path

from pricing.urls import router

router.register(r'division', views.DivisionViewSet)
router.register(r'upazila', views.UpazilaViewSet)
router.register(r'zone', views.ZoneViewSet)
# router.register(r'location_zone', views.LocationZoneAPI.as_view(),basename='location_zone')


urlpatterns = [
    path('division/list', views.DivisionListView.as_view(), name='division_list'),
    path('division/add', views.DivisionCreateView.as_view(), name='division_add'),
    path('division/<int:pk>/update', views.DivisionUpdateView.as_view(), name='division_update'),
    path('division/<int:pk>/delete', views.DivisionDeleteView.as_view(), name='division_delete'),

    path('upazila/list', views.UpazilaListView.as_view(), name='upazila_list'),
    path('upazila/add', views.UpazilaCreateView.as_view(), name='upazila_add'),
    path('upazila/<int:pk>/update', views.UpazilaUpdateView.as_view(), name='upazila_update'),
    path('upazila/<int:pk>/delete', views.UpazilaDeleteView.as_view(), name='upazila_delete'),

    path('api/location_zone', views.LocationZoneAPI.as_view(), name='location_zone'),

]
