"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from tracker import views
from django.conf import settings
from django.views.generic import TemplateView
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('tracker.urls')),
    path('logout/', views.logout_api, name='logout'),
    path('signup/', views.signup, name='signup'),
    path('get-csrf/', views.get_csrf),
    path('login/', views.login_api),

    # Serve media files in ALL environments (including production on Render)
    # Must be BEFORE the React SPA catch-all or /media/ will be swallowed by React Router
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),

    # React SPA catch-all — must be LAST
    re_path(r'^(?!media/).*$', TemplateView.as_view(template_name='index.html')),
]
