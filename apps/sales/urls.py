from django.urls import path
from django.views.generic import TemplateView

from apps.sales import views
from pricing.urls import router

router.register(r'orders', views.OrderViewSet)
router.register(r'order/products', views.OrderedProductViewSet)
router.register(r'order/packages', views.OrderedPackageListViewSet,basename='order_package')
router.register(r'order/status_update', views.StatusUpdateViewSet)
router.register(r'order/zone_order', views.ZoneOrderViewSet,basename='zone_order')
urlpatterns = [
    path('order/',views.OrderListView.as_view(),name='order_list'),
    path('order_new/',views.OrderListNewView.as_view(),name='order_list_new'),
    path('order/create/',views.OrderCreateView.as_view(),name='order_create'),
    path('order/edit/<int:pk>',views.OrderUpdateView.as_view(),name='order_edit'),
    path('order/<int:order_id>/status_update/',views.StatusUpdateView.as_view(),name='order_status_update'),
    path('order/<int:order_id>/invoice/',views.OrderInvoiceView.as_view(),name='order_invoice'),
    path('order/products',views.OrderedProduct.as_view(),name='ordered_product'),
    path('order/product_size',views.OrderedProductSizeQuantity.as_view(),name='ordered_product_size_list'),
    path('order/packages',views.OrderedPackage.as_view(),name='ordered_package'),
    path('order/invoice',TemplateView.as_view(template_name="sales/order/invoice/invoice.html")),
    path('order/invoice2',TemplateView.as_view(template_name="sales/order/invoice/invoice2.html")),
    path('order/invoice3',TemplateView.as_view(template_name="sales/order/invoice/invoice3.html")),
    path('order/product_size/api/',views.OrderedProductSizeViewSet.as_view(),name='ordered_product_size'),
    path('order/zone',views.ZoneOrderList.as_view(),name='zone_order'),
    path('order/invoices',views.ActiveOrderInvoiceList.as_view(),name='active_order_invoice_pdf'),
]