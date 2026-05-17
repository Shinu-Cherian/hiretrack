"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path
from django.urls import include
from tracker import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('tracker.urls')),
    path('logout/', views.logout_api, name='logout'),
    path('signup/', views.signup, name='signup'),
    path('get-csrf/', views.get_csrf),
    path('login/', views.login_api),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
