from django.urls import path

from . import views

urlpatterns = [
	path('', views.index, name='index'),
    path('check_login', views.check_login, name='check_login'),
    path('signup', views.signup, name='signup'),
    path('fetch_products', views.fetch_products, name='fetch_products'),
    path('add_product_to_cart', views.add_product_to_cart, name='add_product_to_cart'),
    path('get_cart', views.get_cart, name='get_cart'),
    path('get_cart_products', views.get_cart_products, name='get_cart_products'),
    path('send_email', views.send_email, name='send_email'),
    path('clear_cart', views.clear_cart, name='clear_cart'),
    path('remove_product_from_cart', views.remove_product_from_cart, name='remove_product_from_cart')    
]