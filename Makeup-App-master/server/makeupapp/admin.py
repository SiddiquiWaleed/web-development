from django.contrib import admin
from .models import User
from .models import Product
from .models import Cart

admin.site.register(User)
admin.site.register(Product)
admin.site.register(Cart)
