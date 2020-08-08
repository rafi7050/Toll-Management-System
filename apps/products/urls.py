from django.urls import path

from apps.products import views
from pricing.urls import router

router.register(r'product', views.ProductViewSet)
router.register(r'age_group', views.AgeGroupViewSet)
router.register(r'nutrition_point', views.NutritionPointViewSet)
urlpatterns = [
    path('product/', views.ProductListView.as_view(), name='product_list'),
    path('product/create', views.ProductCreateView.as_view(), name='product_create'),
    path('product/edit/<int:pk>', views.ProductEditView.as_view(), name='product_update'),

    path('age_group/', views.AgeGroupListView.as_view(), name='age_group_list'),
    path('age_group/create', views.AgeGroupCreateView.as_view(), name='age_group_create'),
    path('age_group/edit/<int:pk>', views.AgeGroupEditView.as_view(), name='age_group_update'),


    path('nutrition_point/', views.NutritionPointListView.as_view(), name='nutrition_point_list'),
    path('nutrition_point/create', views.NutritionPointCreateView.as_view(), name='nutrition_point_create'),
    path('nutrition_point/edit/<int:pk>', views.NutritionPointEditView.as_view(), name='nutrition_point_update'),



]
