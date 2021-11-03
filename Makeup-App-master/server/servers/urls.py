
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('makeupapp/', include('makeupapp.urls')),
    path('admin/', admin.site.urls),
]
